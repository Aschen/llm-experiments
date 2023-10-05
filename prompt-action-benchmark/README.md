# Prompt Engineering: Agent actions format

This experiment is about finding the best action format for defining available actions in an Agent prompt.

The format of the actions have an influence on the LLM performance.

### JSON

`{ "action": "READ_FUNCTION", "parameters": { "filePath": "// path to the file containing the function", "functionName": "// name of the function" } }`

### XML

```
<Action name="READ_FUNCTION">
  <Parameter name="filePath">
    // path to the file containing the function
  </Parameter>

  <Parameter name="functionName">
    // name of the function
  </Parameter>
</Action>
```

### Markdown

_it's not really markdown but it's close_

```
# Action:READ_FUNCTION
filePath: // path to the file containing the function
functionName: // name of the function
# end
```

## Benchmark

The benchmark is composed of 2 prompts:

- the answer for the first one is a maximum of 3 expected call to the `READ_FUNCTION` action
- the for the second of is the action `DONE`

The score function will give 1 point for every correct answer.

The XML format is more performant than JSON or Markdown:

- less parsing errors
- better reasoning

I suspect it's because XML is closer to human language than the others.

### Using GPT4

Scores:

- markdown: 76 (some of the answered action when not correctly formated)
- json: 62 (some of the answer contained only 1 action instead of the 3 expected)
- xml: 80

### Using GPT3.5

Scores:

- markdown: 35
- json: 40
- xml: 44
