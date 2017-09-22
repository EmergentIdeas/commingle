
let commingle = function(toRun) {
	
	let runnable = function(arg1 = {}, arg2 = {}, next) {
		let curParts
		
		const startPart = function() {
			if(toRun.length > 0) {
				curParts = toRun.shift()
				if(typeof curParts == 'function') {
					curParts = [curParts]
				}
				for(const part of curParts) {
					process.nextTick(function() {
						part(arg1, arg2, function() {
							curParts.splice(curParts.indexOf(part), 1)
							if(curParts.length == 0) {
								startPart()
							}
						})
					})
				}
			}
			else {
				if(next) {
					next()
				}
			}
		}
		
		startPart()
	}
	
	return runnable
}

module.exports = commingle