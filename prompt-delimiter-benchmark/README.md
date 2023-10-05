# Prompt Engineering: information delimiter

This experiment is about delimiting huge chunk of informations inside the prompt.

When given a huge chunk of information containing a lot of natural language (e.g. page web content), the following effects can occur:

- less attention to the prompt instructions
- increase hallucinations

In overall, it reduce the LLM performances.

## Solution

Big chunk of information containing natural language should be inserted into the prompt with delimiter.

Example:

```
Extract the images from this page web:

# BEGINNING PÄGE HTML
{pageHTML}
# END PAGE HTML
```

## Benchmark

_Benchmarks are run only with `gpt-3.5-turbo-16k` to have a big enough context window_

The benchmark use a prompt to extract the images of a web page. For each image, the URL and description (according to nearest sentences) should be returned.

The score represents the number of correctly extracted images from the web page.

### Result for basic prompt

- score: 81
- many descriptions of the images are not accurate (e.g. `image illustrating the test n°5 of the article`)

### Result for delimited prompt

- score: 90
- every images are correctly described (e.g. `image illustrating GPT-4V on object detection`)
