/* 
* @Author: Mike Reich
* @Date:   2016-02-12 09:47:31
* @Last Modified 2016-09-09
*/

'use strict';

import Pipeliner from '../'

import {application as app} from 'nxus-core'

describe("Pipeliner", () => {
  var pipeliner, app;
 
  beforeEach(() => {
    pipeliner = new Pipeliner();
  });
  
  describe("Load", () => {
    it("should not be null", () => Pipeliner.should.not.be.null)

    it("should be instantiated", () => {
      pipeliner = new Pipeliner();
      pipeliner.should.not.be.null;
    });
  });

  describe("Init", () => {
    it("should have _pipeliens after load", () => {
      pipeliner.should.have.property('_pipelines');
    });
  });

  describe("Providers", () => {
    it("should return a pipeline", () => {
      pipeliner.pipeline('testPipeline')
      pipeliner.getPipeline('testPipeline').should.exist
      pipeliner.getPipeline('testPipeline').should.be.empty
    })

    it("should return all pipelines", () => {
      pipeliner.pipeline('testPipeline')
      pipeliner.getPipelines().should.exist
      pipeliner.getPipelines().should.have.property('testPipeline')
    })
  })

  describe("Run a Pipeline", () => {  
    it('should register a pipeline job', () => {
      pipeliner.pipeline('testPipeline')
      pipeliner.task('testPipeline', () => {})
      pipeliner._pipelines.should.have.property('testPipeline')
      pipeliner._pipelines['testPipeline'].should.be.a('array')
      pipeliner._pipelines['testPipeline'].length.should.be.above(0)
    })

    it('should run a pipeline job', (done) => {
      pipeliner.pipeline('testPipeline')
      pipeliner.task('testPipeline', done)
      pipeliner.run('testPipeline')
    })

    it('should pass the arguments to the job', (done) => {
      let args = 'args'
      pipeliner.pipeline('testPipeline')
      pipeliner.task('testPipeline', (a) => {
        chai.should().exist(a)
        a.should.equal(args)
        done()
      })
      pipeliner.run('testPipeline', args)
    })

    it('should run multiple pipeline jobs', (done) => {
      let runtimes = 0
      let increment = () => runtimes++
      pipeliner.pipeline('testPipeline')
      pipeliner.task('testPipeline', increment)
      pipeliner.task('testPipeline', increment)
      pipeliner.task('testPipeline', () => {
        increment(); 
        runtimes.should.equal(3);
        done();
      })
      pipeliner.run('testPipeline')
    })

    it('should make changes to data', (done) => {
      let data = {runtimes: 0}
      let job = (d) => {d.runtimes++}
      pipeliner.pipeline('testPipeline')
      pipeliner.task('testPipeline', job)
      pipeliner.task('testPipeline', job)
      pipeliner.task('testPipeline', (d) => {
        chai.should().exist(d)
        d.should.have.property('runtimes')
        d.runtimes.should.be.above(1)
        done()
      })
      pipeliner.run('testPipeline', data)
    })
  })
});