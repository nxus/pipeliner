/* 
* @Author: Mike Reich
* @Date:   2016-02-12 09:47:31
* @Last Modified 2016-05-20
*/

'use strict';

import Pipeliner from '../src/'

import TestApp from 'nxus-core/lib/test/support/TestApp';

describe("Pipeliner", () => {
  var pipeliner, app;
 
  beforeEach(() => {
    app = new TestApp();
    pipeliner = new Pipeliner(app);
  });
  
  describe("Load", () => {
    it("should not be null", () => Pipeliner.should.not.be.null)

    it("should be instantiated", () => {
      pipeliner = new Pipeliner(app);
      pipeliner.should.not.be.null;
    });
  });

  describe("Init", () => {
    it("should have _pipeliens after load", () => {
      return app.emit('load').then(() => {
        pipeliner.should.have.property('_pipelines');
      });
    });

    it("should register gathers", () => {
      return app.emit('load').then(() => {
        app.get.calledWith('pipeliner').should.be.true;
        app.get().gather.calledWith('pipeline').should.be.true;
        app.get().gather.calledWith('task').should.be.true;
      });
    })

    it("should register a handler for getPipelines", () => {
      return app.emit('load').then(() => {
        app.get().respond.calledWith('getPipelines').should.be.true;
      });
    })

    it("should register a handler for getPipeline", () => {
      return app.emit('load').then(() => {
        app.get().respond.calledWith('getPipeline').should.be.true;
      });
    })

    it("should register a handler for run", () => {
      return app.emit('load').then(() => {
        app.get().respond.calledWith('run').should.be.true;
      });
    }) 
  });

  describe("Providers", () => {
    it("should return a pipeline", () => {
      app.emit('load').then(() => {
        app.get('pipeliner').use(pipeliner)
        pipeliner.pipeline('testPipeline')
        app.get('pipeliner').request('getPipeline', 'testPipeline', (pipeline) => {
          should.exist(pipeline)
        })
      })
    })

    it("should return all pipelines", () => {
      app.emit('load').then(() => {
        app.get('pipeliner').use(pipeliner)
        pipeliner.pipeline('testPipeline')
        app.get('pipeliner').request('getPipelines', (pipelines) => {
          should.exist(pipeline)
          pipeline.should.have.property('testPipeline')
        })
      })
    })
  })

  describe("Run a Pipeline", () => {  
    it('should register a pipeline job', (done) => {
      app.emit('load').then(() => {
        pipeliner.pipeline('testPipeline')
        pipeliner.task('testPipeline', 'collect', () => {})
        pipeliner._pipelines.should.have.property('testPipeline')
        chai.should().exist(pipeliner._pipelines['testPipeline'])
        pipeliner._pipelines['testPipeline'].should.be.a('object')
        pipeliner._pipelines['testPipeline'].should.have.property('collect')
        pipeliner._pipelines['testPipeline']['collect'].should.be.a('array')
        pipeliner._pipelines['testPipeline'].should.have.property('process')
        pipeliner._pipelines['testPipeline']['process'].should.be.a('array')
        pipeliner._pipelines['testPipeline'].should.have.property('generate')
        pipeliner._pipelines['testPipeline']['generate'].should.be.a('array')
        pipeliner._pipelines['testPipeline']['collect'].length.should.be.above(0)
        done()
      })
    })

    it('should run a pipeline job', (done) => {
      app.emit('load').then(() => {
        pipeliner.pipeline('testPipeline')
        pipeliner.task('testPipeline', 'collect', done)
        pipeliner.run('testPipeline')
      })
    })

    it('should pass the arguments to the job', (done) => {
      let args = 'args'
      app.emit('load').then(() => {
        pipeliner.pipeline('testPipeline')
        pipeliner.task('testPipeline', 'collect', (a) => {
          chai.should().exist(a)
          a.should.equal(args)
          done()
        })
        pipeliner.run('testPipeline', args)
      })
    })

    it('should run multiple pipeline jobs', (done) => {
      let runtimes = 0
      let increment = () => runtimes++
      app.emit('load').then(() => {
        pipeliner.pipeline('testPipeline')
        pipeliner.task('testPipeline', 'collect', increment)
        pipeliner.task('testPipeline', 'process', increment)
        pipeliner.task('testPipeline', 'generate', () => {
          increment(); 
          runtimes.should.equal(3);
          done();
        })
        pipeliner.run('testPipeline')
      })
    })

    it('should make changes to data', (done) => {
      let data = {runtimes: 0}
      let job = (d) => {d.runtimes++}
      app.emit('load').then(() => {
        pipeliner.pipeline('testPipeline')
        pipeliner.task('testPipeline', 'collect', job)
        pipeliner.task('testPipeline', 'process', job)
        pipeliner.task('testPipeline', 'generate', (d) => {
          chai.should().exist(d)
          d.should.have.property('runtimes')
          d.runtimes.should.be.above(1)
          done()
        })
        pipeliner.run('testPipeline', data)
      })
    })
  })
});