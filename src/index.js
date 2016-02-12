/* 
* @Author: Mike Reich
* @Date:   2016-02-05 07:45:34
* @Last Modified 2016-02-12
*/

'use strict';

import Promise from 'bluebird'
import _ from 'underscore'

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
 * pipeliner.task('capitalize', 'process', myTask)
 * pipeliner.run('capitalize', data).then(() => {
 *   console.log('data') // {word: 'HELLO'}
 * })
 * 
 */
export default class Pipeliner {
  constructor(app) {
    this.app = app
    this._pipelines = {}
    
    this.app.get('pipeliner').use(this)
    .gather('pipeline')
    .gather('task')
    .respond('getPipelines')
    .respond('getPipeline')
    .respond('run')
    .respond('stages')
    

    this.app.log.debug('Pipeliner setting up')
  }

  /**
   * Create a new pipeline.
   * @param  {string} pipeline The name of the pipeline to create
   */
  pipeline(pipeline) {
    this.app.log.debug('Creating pipeline')
    if(this._pipelines[pipeline]) return
    this._pipelines[pipeline] = {
      'collect': [],
      'process': [],
      'generate': []
    }
  }

  /**
   * Define stages for a pipeline
   * @param  {array} stages   An array of strings, each string being the name of a stage. Stages are executed in the order in the array.
   * @param  {string} pipeline The name of the pipeline to use the stages.
   * @return {[type]}          [description]
   */
  stages(stages, pipeline) {
    if(!this._pipelines[pipeline]) this.pipeline(pipeline)
    stages.each(stage => this._pipelines[pipeline][stage] = [])
  }

  /**
   * Defintes a task for a pipeline and a stage.
   * @param  {string} pipeline The name of the pipeline
   * @param  {string} stage    The name of the string
   * @param  {function} job      A function which accepts data
   */
  task(pipeline, stage, job) {
    this.app.log.debug('Registering job', pipeline, stage)
    if(!this._pipelines[pipeline]) this.pipeline(pipeline)
    if(!this._pipelines[pipeline][stage]) this._pipelines[pipeline][stage] = []
    this._pipelines[pipeline][stage].push(job)
  }

  /**
   * Returns all pipelines which have been defined
   * @return {object} A hash of the pipelines.
   */
  getPipelines() {
    return this._pipelines
  }

  /**
   * Returns a specific pipeline
   * @param  {string} pipeline The name of a pipeline to return.
   * @return {object}          The pipeline object.
   */
  getPipeline(pipeline) {
    return this._pipelines[pipeline]
  }

  /**
   * Runs the specified pipeline, passing the arguments to each task.
   * @param  {string}    pipeline the pipeline to run
   * @param  {...object} args     Arguments to pass to the pipeline tasks
   * @return {Promise}             A promise that is executed when the pipeline completes.
   */
  run(pipeline, ...args) {
    this.app.log.debug('Running pipeline', pipeline)
    if(!this._pipelines[pipeline]) throw new Error('The specified pipeline \''+pipeline+'\' doesn\'t exist.')
    let _jobs = []
    for (let stage in this._pipelines[pipeline]) {
      _jobs = _jobs.concat(this._pipelines[pipeline][stage])
    }
    return Promise.mapSeries(_jobs, (job) => {return Promise.resolve(job(...args))})
  }
} 