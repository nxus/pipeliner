/* 
* @Author: Mike Reich
* @Date:   2016-02-05 07:45:34
* @Last Modified 2016-02-12
*/

'use strict';

import Promise from 'bluebird'
import _ from 'underscore'

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

  pipeline(pipeline) {
    this.app.log.debug('Creating pipeline')
    if(this._pipelines[pipeline]) return
    this._pipelines[pipeline] = {
      'collect': [],
      'process': [],
      'generate': []
    }
  }

  stages(stages, pipeline) {
    if(!this._pipelines[pipeline]) this.pipeline(pipeline)
    stages.each(stage => this._pipelines[pipeline][stage] = [])
  }

  task(pipeline, stage, job) {
    this.app.log.debug('Registering job', pipeline, stage)
    if(!this._pipelines[pipeline]) this.pipeline(pipeline)
    if(!this._pipelines[pipeline][stage]) this._pipelines[pipeline][stage] = []
    this._pipelines[pipeline][stage].push(job)
  }

  getPipelines() {
    return this._pipelines
  }

  getPipeline(pipeline) {
    return this._pipelines[pipeline]
  }

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