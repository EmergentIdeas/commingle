var co = require('../commingle')
require('mocha')
var expect = require('chai').expect
var assert = require('chai').assert

describe("basic tests for functionality", function() {
	it("one function", function(done) {
		let a = {}
		let b = {}
		
		let p = function(arg1, arg2, next) {
			arg1.one = 1
			arg2.one = 1
			next()
			done()
		}
		
		co([p])()
	})

	it("line of functions", function(done) {
		let a = {
			one: 1
		}
		let b = {}
		
		let c = function(arg1, arg2, next) {
			setTimeout(function() {
				arg1.one = arg1.one + 1
				next()
			}, 100)
		}
		
		let f = function(arg1, arg2, next) {
			if(arg1.one == 3) {
				next()
				done()
			}
			else {
				next()
				done(new Error("Not all functions run first. Value: " + arg1.one))
			}
		}
		
		co([c, c, f])(a, b)
	})
	
	it("par functions", function(done) {
		let a = {
			one: 0
		}
		let b = {
			par: 1,
			sum: []
		}
		
		let first = function(arg1, arg2, next) {
			arg1.one = 1
			next()
		}
		
		let mid = function(arg1, arg2, next) {
			const myCof = arg2.par++;
			arg2.sum.push(myCof * arg1.one)
			next()
		}
		
		
		let f = function(arg1, arg2, next) {
			let total = 0
			for(let num of arg2.sum) {
				total += num
			}
			
			if(total === 6) {
				next()
				done()
			}
			else {
				next()
				done(new Error("Not all functions run first. Value: " + total))
			}
		}
		
		co([first, [mid, mid, mid], f])(a, b)
	})

	it("specified done callback", function(done) {
		let a = {
			one: 0
		}
		let b = {
			par: 1,
			sum: []
		}
		
		let first = function(arg1, arg2, next) {
			arg1.one = 1
			next()
		}
		
		let mid = function(arg1, arg2, next) {
			const myCof = arg2.par++;
			arg2.sum.push(myCof * arg1.one)
			next()
		}
		
		
		let f = function(arg1, arg2, next) {
			let total = 0
			for(let num of arg2.sum) {
				total += num
			}
			
			if(total === 6) {
				next()
			}
			else {
				done(new Error("Not all functions run first. Value: " + total))
			}
		}
		
		co([first, [mid, mid, mid], f])(a, b, done)
	})
	
	
	it("par functions with async next", function(done) {
		let a = {
			one: 0
		}
		let b = {
			par: 1,
			sum: []
		}
		
		let first = function(arg1, arg2, next) {
			arg1.one = 1
			next()
		}
		
		let mid = function(arg1, arg2, next) {
			setTimeout(function() {
				const myCof = arg2.par++;
				arg2.sum.push(myCof * arg1.one)
				next()
			}, 50)
		}
		
		
		let f = function(arg1, arg2, next) {
			let total = 0
			for(let num of arg2.sum) {
				total += num
			}
			
			if(total === 6) {
				next()
				done()
			}
			else {
				next()
				done(new Error("Not all functions run first. Value: " + total))
			}
		}
		
		co([first, [mid, mid, mid], f])(a, b)
	})

	
})