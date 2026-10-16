import { readModelConfig } from "../server/config";

const model = readModelConfig();

if (!process.env.REDIS_URL) {
  console.log("worker 未连接队列：REDIS_URL 未配置");
} else if (!model.configured) {
  console.log(`worker 未调用模型：${model.reason}`);
} else {
  console.log("worker 配置已齐，队列消费尚未接入");
}
