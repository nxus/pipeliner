# Nxus Pipeliner

[![Build Status](https://travis-ci.org/nxus/pipeliner.svg?branch=master)](https://travis-ci.org/nxus/pipeliner)

A framework for creating and running data pipelines.  Data pipelines have stages, which are made of an arbitrary number of tasks.  Stages and tasks are run in serial: once a task completes, the next task in the pipeline is executed.  

Pipelines take a data object as input, and each task operates on the object in some way.

For an example of the Pipeliner in action, checkout the [nxus-static-site](https://github.com/seabourne/nxus-static-site) module.

## Installation

    > npm install @nxus/pipeliner --save

## Usage

### Step 1: Define a pipeline

    app.get('pipeliner').pipeline('my-pipeline')

### Step 1a: Define stages

By default, every pipeline is pre-configured with three stages: 'collect', 'process', 'generate'.  However, you can define your own stages:

    app.get('pipliner').stages('my-pipeline', ['stage1', 'stage2', 'stage3'])

### Step 2: Define tasks

A task is a javascript function that accepts any objects passed into the pipeline when it is run.

    let myTask = (word) => {
      word.toUpperCase();
    }

    app.get('pipeliner').task('my-pipeline', 'process', myTask)

### Step 3: Run a pipeline

Once all the tasks for a pipeline have been defined, the last step is to run the pipeline.

    app.get('pipeliner').run('my-pipeline', someData)

## API

### Pipeliner

[src/index.js:31-118](https://github.com/nxus/pipeliner/blob/cd928eeb7ec799d9e12f771a9c3eb1ecad94e2bf/src/index.js#L31-L118 "Source code on GitHub")

**Examples**

```javascript
let myTask = (data) => {
  data.word.toUpperCase()
}
let data = {word: 'hello'}

let pipeliner = app.get('pipeliner')

pipeliner.pipeline('capitalize')
pipeliner.task('capitalize', 'process', myTask)
pipeliner.run('capitalize', data).then(() => {
  console.log('data') // {word: 'HELLO'}
})
```

#### getPipeline

[src/index.js:99-101](https://github.com/nxus/pipeliner/blob/cd928eeb7ec799d9e12f771a9c3eb1ecad94e2bf/src/index.js#L99-L101 "Source code on GitHub")

Returns a specific pipeline

**Parameters**

-   `pipeline` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The name of a pipeline to return.

Returns **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** The pipeline object.

#### getPipelines

[src/index.js:90-92](https://github.com/nxus/pipeliner/blob/cd928eeb7ec799d9e12f771a9c3eb1ecad94e2bf/src/index.js#L90-L92 "Source code on GitHub")

Returns all pipelines which have been defined

Returns **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** A hash of the pipelines.

#### pipeline

[src/index.js:52-60](https://github.com/nxus/pipeliner/blob/cd928eeb7ec799d9e12f771a9c3eb1ecad94e2bf/src/index.js#L52-L60 "Source code on GitHub")

Create a new pipeline.

**Parameters**

-   `pipeline` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The name of the pipeline to create

#### run

[src/index.js:109-117](https://github.com/nxus/pipeliner/blob/cd928eeb7ec799d9e12f771a9c3eb1ecad94e2bf/src/index.js#L109-L117 "Source code on GitHub")

Runs the specified pipeline, passing the arguments to each task.

**Parameters**

-   `pipeline` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the pipeline to run
-   `args` **...[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Arguments to pass to the pipeline tasks

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** A promise that is executed when the pipeline completes.

#### stages

[src/index.js:68-71](https://github.com/nxus/pipeliner/blob/cd928eeb7ec799d9e12f771a9c3eb1ecad94e2bf/src/index.js#L68-L71 "Source code on GitHub")

Define stages for a pipeline

**Parameters**

-   `stages` **[array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)** An array of strings, each string being the name of a stage. Stages are executed in the order in the array.
-   `pipeline` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The name of the pipeline to use the stages.

Returns **\[type]** [description]

#### task

[src/index.js:79-84](https://github.com/nxus/pipeliner/blob/cd928eeb7ec799d9e12f771a9c3eb1ecad94e2bf/src/index.js#L79-L84 "Source code on GitHub")

Defintes a task for a pipeline and a stage.

**Parameters**

-   `pipeline` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The name of the pipeline
-   `stage` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The name of the string
-   `job` **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** A function which accepts data
