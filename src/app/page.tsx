import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">内部提案系统</h1>
      <p className="max-w-2xl text-sm leading-6 text-neutral-600">
        账号与权限模块已接入本地口令登录。客户与项目、提案编辑、豆包调用和报价仍按规划分模块实现。
      </p>
      <div className="flex flex-wrap gap-3">
        <Button asChild variant="outline">
          <Link href="/api/health">健康检查</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/users">账号管理</Link>
        </Button>
      </div>
    </section>
  );
}
