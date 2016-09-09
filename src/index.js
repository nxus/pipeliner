/* 
* @Author: Mike Reich
* @Date:   2016-02-05 07:45:34
* @Last Modified 2016-09-09
*/
/**
 * # Pipeliner Module
 * 
 * [![Build Status](https://travis-ci.org/nxus/pipeliner.svg?branch=master)](https://travis-ci.org/nxus/pipeliner)
 * 
 * A framework for creating and running data pipelines.  Data pipelines have stages, which are made of an arbitrary number of tasks.  Stages and tasks are run in serial: once a task completes, the next task in the pipeline is executed.  
 * A task may complete synchronously, or asynchronously through use of a promise. 
 * 
 * Pipelines take a data object as input, and each task operates on the object in some way.
 * 
 * For an example of the Pipeliner in action, checkout the [nxus-static-site](https://github.com/seabourne/nxus-static-site) module.
 * 
 * ## Installation
 * 
 *     > npm install nxus-pipeliner --save
 * 
 * ## Usage
 * 
 * ### Step 1: Define a pipeline
 *
 *     import {pipeliner} from 'nxus-pipeline'
 * 
 *     pipeliner.pipeline('my-pipeline')
 * 
 * 
 * ### Step 2: Define tasks
 * 
 * A task is a javascript function that accepts any objects passed into the pipeline when it is run. Tasks are run serially in FIFO order.
 * 
 *     let myTask = (word) => {
 *       word.toUpperCase();
 *     }
 * 
 *     app.get('pipeliner').task('my-pipeline', myTask)
 * 
 * ### Step 3: Run a pipeline
 * 
 * Once all the tasks for a pipeline have been defined, the last step is to run the pipeline.
 * 
 *     app.get('pipeliner').run('my-pipeline', someData)
 * 
 * # API
 * -----
 */

'use strict';

import Promise from 'bluebird'
import _ from 'underscore'

import {application as app, NxusModule} from 'nxus-core'

/**
 * @class The Pipeliner class is a Nxus module for creating and running data pipelines. 
 * Pipelines can have any number of stages, and stages can have any number of tasks.
 *
 * @example
 * let myTask = (data) => {
 *   data.word.toUpperCase()
 * }
 * let data = {word: 'hello'}
 * 
 * let pipeliner = app.get('pipeliner')
 * 
 * pipeliner.pipeline('capitalize')
 * pipeliner.run('capitalize', data).then(() => {
 *   console.log('data') // {word: 'HELLO'}
 * })
 * 
 */
class Pipeliner extends NxusModule {
  constructor(app) {
    super()
    this._pipelines = {}    

    this.log.debug('Pipeliner setting up')
  }

  /**
   * Create a new pipeline
   * configured with three stages: 'collect', 'process', and 'generate'.
   * Does nothing if the named pipeline already exists.
   * @param  {string} pipeline The name of the pipeline to create
   */
  pipeline(pipeline) {
    this.log.debug('Creating pipeline')
    if(this._pipelines[pipeline]) return
    this._pipelines[pipeline] = []
  }

  /**
   * Defines a task for a pipeline and a stage.
   * Creates the pipeline if it does not already exist;
   * adds the stage if it does not already exist.
   * If multiple tasks are defined for a stage, they are run in the order defined.
   * @param  {string} pipeline The name of the pipeline
   * @param  {function} job      A function which accepts data
   */
  task(pipeline, job) {
    this.log.debug('Registering job', pipeline)
    if(!this._pipelines[pipeline]) this.pipeline(pipeline)
    this._pipelines[pipeline].push(job)
  }

  /**
   * Returns all pipelines which have been defined.
   * @return {object} A hash of the pipelines.
   */
  getPipelines() {
    return this._pipelines
  }

  /**
   * Returns a specific pipeline.
   * @param  {string} pipeline The name of a pipeline to return.
   * @return {object}          The pipeline object.
   */
  getPipeline(pipeline) {
    return this._pipelines[pipeline]
  }

  /**
   * Runs the specified pipeline, passing the arguments to each task.
   * @param  {string}    pipeline The name of the pipeline to run
   * @param  {...object} args     Arguments to pass to the pipeline tasks
   * @return {Promise}            A promise that is fulfilled when the pipeline completes; it is rejected if any task in the pipeline fails (throws an error or returns a promise that is rejected)
   */
  run(pipeline, ...args) {
    this.log.debug('Running pipeline', pipeline)
    if(!this._pipelines[pipeline]) throw new Error('The specified pipeline \''+pipeline+'\' doesn\'t exist.')
    return Promise.mapSeries(this._pipelines[pipeline], job => job(...args))
  }
} 

var pipeliner = Pipeliner.getProxy()
export {Pipeliner as default, pipeliner}