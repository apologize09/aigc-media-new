import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">基础框架已就绪</h1>
      <p className="max-w-2xl text-sm leading-6 text-neutral-600">
        这里只包含工程骨架、健康检查和空的目录边界。登录、提案编辑、豆包调用和报价都还没有实现。产品规则以
        docs/planning 为准。
      </p>
      <Button asChild variant="outline">
        <Link href="/api/health">查看健康检查</Link>
      </Button>
    </section>
  );
}
