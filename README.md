# Nxus Pipeliner

[![Build Status](https://travis-ci.org/nxus/pipeliner.svg?branch=master)](https://travis-ci.org/nxus/pipeliner)

A framework for creating and running data pipelines.  Data pipelines have stages, which are made of an arbitrary number of tasks.  Stages and tasks are run in serial: once a task completes, the next task in the pipeline is executed.  

Pipelines take a data object as input, and each task operates on the object in some way.

For an example of the Pipeliner in action, checkout the [nxus-static-site](https://github.com/seabourne/nxus-static-site) module.

## Installation

```
> npm install @nxus/pipeliner --save
```

## Usage 

### Step 1: Define a pipeline

```
app.get('pipeliner').pipeline('my-pipeline')
```

### Step 1a: Define stages

By default, every pipeline is pre-configured with three stages: 'collect', 'process', 'generate'.  However, you can define your own stages:

```
app.get('pipliner').stages('my-pipeline', ['stage1', 'stage2', 'stage3'])
```

### Step 2: Define tasks

A task is a javascript function that accepts any objects passed into the pipeline when it is run.

```
let myTask = (word) => {
  word.toUpperCase();
}

app.get('pipeliner').task('my-pipeline', 'process', myTask)
```

### Step 3: Run a pipeline

Once all the tasks for a pipeline have been defined, the last step is to run the pipeline.

```
app.get('pipeliner').run('my-pipeline', someData)
```

