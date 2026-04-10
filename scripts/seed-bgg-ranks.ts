import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "csv-parse/sync";
import { PrismaPg } from "@prisma/adapter-pg";
import prismaClient from "@prisma/client";

const { PrismaClient } = prismaClient;
const CSV_CANDIDATES = [
  resolve(process.cwd(), "data/boardgames_ranks.csv"),
  resolve(process.cwd(), "data/bgg_ranks.csv"),
];
const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DIRECT_URL 또는 DATABASE_URL 환경 변수가 필요합니다.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});
const GAME_BATCH_SIZE = 1000;
const LOOKUP_BATCH_SIZE = 5000;
const RELATION_BATCH_SIZE = 5000;

const CATEGORY_TAGS = [
  { csvCol: "abstracts_rank", name: "Abstract", nameKr: "추상" },
  { csvCol: "cgs_rank", name: "Customizable", nameKr: "커스텀" },
  { csvCol: "childrensgames_rank", name: "Children", nameKr: "어린이" },
  { csvCol: "familygames_rank", name: "Family", nameKr: "가족" },
  { csvCol: "partygames_rank", name: "Party", nameKr: "파티" },
  { csvCol: "strategygames_rank", name: "Strategy", nameKr: "전략" },
  { csvCol: "thematic_rank", name: "Thematic", nameKr: "테마" },
  { csvCol: "wargames_rank", name: "War", nameKr: "워게임" },
] as const;

type CsvRow = {
  id: string;
  name: string;
  yearpublished: string;
  rank: string;
  average: string;
  usersrated: string;
  is_expansion: string;
  abstracts_rank?: string;
  cgs_rank?: string;
  childrensgames_rank?: string;
  familygames_rank?: string;
  partygames_rank?: string;
  strategygames_rank?: string;
  thematic_rank?: string;
  wargames_rank?: string;
};

async function main() {
  const { csvPath, csv } = loadCsvContent();

  const rows = parse(csv, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
  }) as CsvRow[];

  const baseGames = rows.filter((row) => row.is_expansion === "0");
  const expansionCount = rows.length - baseGames.length;

  console.log(`CSV 파일: ${csvPath}`);
  console.log(`CSV 로드 완료: 총 ${rows.length.toLocaleString()}행`);
  console.log(`기본 게임: ${baseGames.length.toLocaleString()}개`);
  console.log(`확장팩 제외: ${expansionCount.toLocaleString()}개`);

  await upsertCategoryTags();
  await seedGames(baseGames);
  await seedCategoryRelations(baseGames);

  const [gameCount, tagCount, relationCount] = await Promise.all([
    prisma.game.count(),
    prisma.tag.count(),
    prisma.gameTag.count(),
  ]);

  console.log("");
  console.log("시딩 완료");
  console.log(`- games: ${gameCount.toLocaleString()} rows`);
  console.log(`- tags: ${tagCount.toLocaleString()} rows`);
  console.log(`- game_tags: ${relationCount.toLocaleString()} rows`);
}

async function upsertCategoryTags() {
  for (const category of CATEGORY_TAGS) {
    await prisma.tag.upsert({
      where: { name: category.name },
      update: { nameKr: category.nameKr, type: "genre" },
      create: { name: category.name, nameKr: category.nameKr, type: "genre" },
    });
  }
  console.log(`카테고리 태그 준비 완료: ${CATEGORY_TAGS.length}개`);
}

async function seedGames(rows: CsvRow[]) {
  for (let index = 0; index < rows.length; index += GAME_BATCH_SIZE) {
    const batch = rows.slice(index, index + GAME_BATCH_SIZE);

    await prisma.game.createMany({
      data: batch.map((row) => {
        const genres = CATEGORY_TAGS
          .filter((cat) => hasCategoryRank(row[cat.csvCol]))
          .map((cat) => cat.name);

        return {
          bggId: row.id,
          title: row.name,
          titleEn: row.name,
          releaseYear: parseOptionalInt(row.yearpublished),
          rank: parseRank(row.rank),
          avgRating: parseAverageRating(row.average),
          ratingCount: parsePositiveInt(row.usersrated),
          isExpansion: false,
          genres,
        };
      }),
      skipDuplicates: true,
    });

    console.log(
      `게임 시딩 ${Math.min(index + GAME_BATCH_SIZE, rows.length).toLocaleString()} / ${rows.length.toLocaleString()}`
    );
  }
}

async function seedCategoryRelations(rows: CsvRow[]) {
  const tags = await prisma.tag.findMany({
    where: { name: { in: CATEGORY_TAGS.map((c) => c.name) } },
    select: { id: true, name: true },
  });
  const tagIdByName = new Map(tags.map((t) => [t.name, t.id]));

  const rankedRows = rows.filter((row) =>
    CATEGORY_TAGS.some((cat) => hasCategoryRank(row[cat.csvCol]))
  );
  const bggIds = rankedRows.map((row) => row.id);
  const gameIdByBggId = new Map<string, string>();

  for (let index = 0; index < bggIds.length; index += LOOKUP_BATCH_SIZE) {
    const batchIds = bggIds.slice(index, index + LOOKUP_BATCH_SIZE);
    const games = await prisma.game.findMany({
      where: { bggId: { in: batchIds } },
      select: { id: true, bggId: true },
    });
    for (const game of games) {
      if (game.bggId !== null) {
        gameIdByBggId.set(game.bggId, game.id);
      }
    }
  }

  const relations: Array<{ gameId: string; tagId: string }> = [];

  for (const row of rankedRows) {
    const gameId = gameIdByBggId.get(row.id);
    if (!gameId) continue;

    for (const cat of CATEGORY_TAGS) {
      if (!hasCategoryRank(row[cat.csvCol])) continue;
      const tagId = tagIdByName.get(cat.name);
      if (!tagId) continue;
      relations.push({ gameId, tagId });
    }
  }

  for (let index = 0; index < relations.length; index += RELATION_BATCH_SIZE) {
    const batch = relations.slice(index, index + RELATION_BATCH_SIZE);
    await prisma.gameTag.createMany({ data: batch, skipDuplicates: true });
    console.log(
      `태그 연결 ${Math.min(index + RELATION_BATCH_SIZE, relations.length).toLocaleString()} / ${relations.length.toLocaleString()}`
    );
  }
}

function loadCsvContent() {
  for (const csvPath of CSV_CANDIDATES) {
    if (!existsSync(csvPath)) continue;
    const csv = readFileSync(csvPath, "utf8");
    if (csv.trim().length > 0) return { csvPath, csv };
  }
  throw new Error(
    ["읽을 수 있는 CSV 파일을 찾지 못했습니다.", ...CSV_CANDIDATES.map((p) => `- ${p}`)].join("\n")
  );
}

function parseOptionalInt(value: string | undefined) {
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function parsePositiveInt(value: string | undefined) {
  const parsed = parseOptionalInt(value);
  return parsed !== null && parsed > 0 ? parsed : null;
}

function parseRank(value: string | undefined) {
  const parsed = parseOptionalInt(value);
  return parsed !== null && parsed > 0 ? parsed : null;
}

function parseAverageRating(value: string | undefined) {
  if (!value) return null;
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return Math.round((parsed / 2) * 10) / 10;
}

function hasCategoryRank(value: string | undefined) {
  const parsed = parseOptionalInt(value);
  return parsed !== null && parsed > 0;
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
