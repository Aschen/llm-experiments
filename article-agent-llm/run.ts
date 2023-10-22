import { stacktrace } from "./example/inputs";
import { WalkCallStackAgent } from "./lib/WalkCallStackAgent";
import { BugFixAgent } from "./lib/BugfixAgent";

const walkCallStackAgent = new WalkCallStackAgent({ stacktrace });

await walkCallStackAgent.run();

const bugfixAgent = new BugFixAgent({
  stacktrace,
  userFunctions: walkCallStackAgent.userFunctions,
});

await bugfixAgent.run();
