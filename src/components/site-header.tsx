import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-neutral-200">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <p className="text-sm font-medium">AIGC 提案系统</p>
        <nav className="flex gap-4 text-sm">
          <Link href="/">概览</Link>
          <Link href="/login">登录</Link>
        </nav>
      </div>
    </header>
  );
}
