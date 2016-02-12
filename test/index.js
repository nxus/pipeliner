/* 
* @Author: Mike Reich
* @Date:   2016-02-12 09:47:31
* @Last Modified 2016-02-12 @Last Modified time: 2016-02-12 09:47:31
*/

'use strict';

import Pipeliner from '../src/'

import TestApp from '@nxus/core/lib/test/support/TestApp';

describe("Pipeliner", () => {
  var pipeliner;
  var app = new TestApp();
 
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
    // it("should register for app lifecycle", () => {
    //   app.once.called.should.be.true;
    //   app.once.calledWith('launch').should.be.true;
    //   app.once.calledWith('stop').should.be.true;
    // });

    // it("should have port after load", () => {
    //   return app.emit('load').then(() => {
    //     pipeliner.should.have.property('port');
    //     pipeliner.should.have.property('routeTable');
    //   });
    // });

    // it("should register a gather for routes", () => {
    //   return app.emit('load').then(() => {
    //     app.get.calledWith('pipeliner').should.be.true;
    //     app.get().gather.calledWith('route').should.be.true;
    //   });
    // })

    // it("should register a handler for getExpressApp", () => {
    //   return app.emit('load').then(() => {
    //     app.get().respond.calledWith('getExpressApp').should.be.true;
    //   });
    // })

    // it("should register a handler for setStatic", () => {
    //   return app.emit('load').then(() => {
    //     app.get().respond.calledWith('setStatic').should.be.true;
    //   });
    // })

    // it("should register a handler for setRoute", () => {
    //   return app.emit('load').then(() => {
    //     app.get().respond.calledWith('setRoute').should.be.true;
    //   });
    // })

    // it("should register a handler for setRoute.get", () => {
    //   return app.emit('load').then(() => {
    //     app.get().respond.calledWith('setRoute.get').should.be.true;
    //   });
    // })

    // it("should register a handler for setRoute.post", () => {
    //   return app.emit('load').then(() => {
    //     app.get().respond.calledWith('setRoute.post').should.be.true;
    //   });
    // })    
  });

  describe("Providers", () => {
    // it("should return an expressApp", () => {
    //   app.emit('load').then(() => {
    //     app.get('pipeliner').use(pipeliner)
    //     app.get('pipeliner').request('getExpressApp', (expressapp) => {
    //       should.exist(expressapp)
    //       expressapp.should.have.property('use')
    //     })
    //   })
    // })

    // it('should return the routing table', () => {
    //   app.emit('load').then(() => {
    //     app.get('pipeliner').use(pipeliner)
    //     app.get('pipeliner').provide('route', 'get', '/somepath', () => {})
    //     app.get('pipeliner').request('getRoutes', (routes) => {
    //       should.exist(routes)
    //       should.exist(routes['/somepath'])
    //     })
    //   })
    // })
  })
});