# Prompt Engineering: Language benchmark

This experiment is about how the language influence the performances of the LLM.

Since there is much more english training data, the LLM is better when the prompt is written in english.

## Benchmark

The benchmark is composed of 2 prompts:

- [english prompt](./english.ts)
- [french prompt](./french.ts)

The score function evaluate the number of steps necessary for the LLM to read all the functions.

It can read from 1 to N functions at a time, best performances are when the LLM realize it can read all the function in at the same time.

The score function will give 1 point for every correct answer.

The english prompt have a final score of **30** compare to **26** for the french prompt.

It means the LLM was able to understand better the instructions when they were given in English.
