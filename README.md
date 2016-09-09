# nxus-pipeliner

## 

## Pipeliner Module

[![Build Status](https://travis-ci.org/nxus/pipeliner.svg?branch=master)](https://travis-ci.org/nxus/pipeliner)

A framework for creating and running data pipelines.  Data pipelines have stages, which are made of an arbitrary number of tasks.  Stages and tasks are run in serial: once a task completes, the next task in the pipeline is executed.  

Pipelines take a data object as input, and each task operates on the object in some way.

For an example of the Pipeliner in action, checkout the [nxus-static-site](https://github.com/seabourne/nxus-static-site) module.

### Installation

    > npm install nxus-pipeliner --save

### Usage

#### Step 1: Define a pipeline

    import {pipeliner} from 'nxus-pipeline'

    pipeliner.pipeline('my-pipeline')

#### Step 2: Define tasks

A task is a javascript function that accepts any objects passed into the pipeline when it is run. Tasks are run serially in FIFO order.

    let myTask = (word) => {
      word.toUpperCase();
    }

    app.get('pipeliner').task('my-pipeline', myTask)

#### Step 3: Run a pipeline

Once all the tasks for a pipeline have been defined, the last step is to run the pipeline.

    app.get('pipeliner').run('my-pipeline', someData)

## API

* * *

## Pipeliner

**Extends NxusModule**

**Examples**

```javascript
let myTask = (data) => {
  data.word.toUpperCase()
}
let data = {word: 'hello'}

let pipeliner = app.get('pipeliner')

pipeliner.pipeline('capitalize')
pipeliner.run('capitalize', data).then(() => {
  console.log('data') // {word: 'HELLO'}
})
```

### pipeline

Create a new pipeline.

**Parameters**

-   `pipeline` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The name of the pipeline to create

### task

Defintes a task for a pipeline and a stage.

**Parameters**

-   `pipeline` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The name of the pipeline
-   `job` **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** A function which accepts data

### getPipelines

Returns all pipelines which have been defined

Returns **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** A hash of the pipelines.

### getPipeline

Returns a specific pipeline

**Parameters**

-   `pipeline` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The name of a pipeline to return.

Returns **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** The pipeline object.

### run

Runs the specified pipeline, passing the arguments to each task.

**Parameters**

-   `pipeline` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the pipeline to run
-   `args` **...[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Arguments to pass to the pipeline tasks

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** A promise that is executed when the pipeline completes.
