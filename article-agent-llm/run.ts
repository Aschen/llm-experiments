import { WalkCallStackAgent } from "./lib/WalkCallStackAgent";
import { stacktrace } from "./example/inputs";

const agent = new WalkCallStackAgent({ stacktrace });

await agent.run();
