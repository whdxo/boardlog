import MobileHeader from "@/components/layout/MobileHeader";

export default function AccountSettingsPage() {
  return (
    <div className="max-w-lg mx-auto">
      <MobileHeader variant="back" title="계정 정보" />
      <div className="px-4 md:px-6 py-6 flex flex-col gap-4">
        <h1 className="text-h1 font-bold text-gray-900 hidden md:block">계정 정보</h1>

        {[
          { label: "이메일", value: "user@example.com" },
          { label: "닉네임", value: "보드게이머" },
          { label: "가입일", value: "2024년 1월 1일" },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between py-4 border-b border-gray-100">
            <span className="text-caption text-gray-500">{item.label}</span>
            <span className="text-body font-medium text-gray-900">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
