import { h3lp } from 'h3lp'
import { Evaluator, Context, Step, Operand, OperandType } from '../../../../domain'

export class PropertyProcessEvaluator extends Evaluator {
	public eval (context: Context): any {
		const value = this.operand.children[0].eval(context)
		if (value === undefined || value === null) return null
		return h3lp.obj.getValue(value, this.operand.name)
	}
}
export abstract class ProcessEvaluator {
	// eslint-disable-next-line no-useless-constructor
	public constructor (protected readonly operand: Operand) {}
	public abstract eval(context: Context, step:Step): any
	protected solveChildren (context: Context, step:Step): any {
		for (let i = step.values.length - 1; i < this.operand.children.length; i++) {
			const value = this.operand.children[i].eval(context)
			if (context.token.isBreak) {
				return value
			}
			step.values.push(value)
		}
		return step.values
	}
}
export class StackEvaluator extends Evaluator {
	// eslint-disable-next-line no-useless-constructor
	public constructor (protected readonly operand: Operand, private readonly child:ProcessEvaluator) {
		super(operand)
	}

	public eval (context: Context) {
		if (this.operand.id === undefined) {
			throw new Error(`Operand ${this.operand.name} id undefined`)
		}
		let step:Step = context.token.stack[this.operand.id] as Step
		if (step === undefined) {
			step = new Step(this.operand.name, this.operand.id)
			context.token.stack[this.operand.id] = step
		}
		const result = this.child.eval(context, step)
		if (!context.token.isBreak) {
			// remove stack
			delete context.token.stack[this.operand.id]
		}
		return result
	}
}
export class ListProcessEvaluator extends ProcessEvaluator {
	public eval (context: Context, step:Step): any {
		return this.solveChildren(context, step)
	}
}
export class ObjProcessEvaluator extends ProcessEvaluator {
	public eval (context: Context, step:Step): any {
		const result = this.solveChildren(context, step)
		if (context.token.isBreak) {
			return result
		}
		const obj: { [k: string]: any } = {}
		for (let i = 0; i < result.length; i++) {
			obj[this.operand.children[i].name] = result
		}
		return obj
	}
}
export class CallFuncProcessEvaluator extends ProcessEvaluator {
	// eslint-disable-next-line no-useless-constructor, @typescript-eslint/ban-types
	public constructor (protected readonly operand: Operand, private readonly _function: Function) {
		super(operand)
	}

	public eval (context: Context, step:Step): any {
		const result = this.solveChildren(context, step)
		if (context.token.isBreak) {
			return result
		}
		return this._function(...result)
	}
}
export class BlockProcessEvaluator extends ProcessEvaluator {
	public eval (context: Context, step:Step): any {
		const result = this.solveChildren(context, step)
		if (context.token.isBreak) {
			return result
		}
		if (result.length > 0) {
			return result[result.length - 1]
		}
		return null
	}
}
export class IfProcessEvaluator extends ProcessEvaluator {
	public eval (context: Context, step:Step): any {
		if (step.values.length === 0) {
			const condition = this.operand.children[0].eval(context)
			if (context.token.isBreak) {
				return condition
			}
			step.values.push(condition)
		}
		if (step.values[0]) {
			// if condition is true evaluate block if
			const value = this.operand.children[1].eval(context)
			if (!context.token.isBreak) {
				step.values.push(value)
			}
			return value
		} else if (this.operand.children.length > 2) {
			// if had else if or else , evaluate them
			let value
			for (let i = step.values.length - 1; i < this.operand.children.length; i++) {
				if (this.operand.children[i].type === OperandType.ElseIf) {
					const elseIfCondition = this.operand.children[i].children[0].eval(context)
					if (elseIfCondition) {
						value = this.operand.children[i].children[1].eval(context)
					}
				} else {
					// else block
					value = this.operand.children[i].eval(context)
				}
				if (context.token.isBreak) {
					return value
				}
				step.values.push(value)
			}
			return value
		}
	}
}
export class WhileProcessEvaluator extends ProcessEvaluator {
	public eval (context: Context, step:Step): any {
		const condition = this.operand.children[0]
		const block = this.operand.children[1]
		let blockResult:any = null
		// evaluate condition
		if (step.values.length === 0) {
			const conditionResult = condition.eval(context)
			if (context.token.isBreak) {
				return conditionResult
			}
			step.values.push(conditionResult)
		}
		while (step.values[0]) {
			// evaluate condition
			if (step.values.length === 1) {
				blockResult = block.eval(context)
				if (context.token.isBreak) {
					return blockResult
				}
				step.values.push(blockResult)
			}
			// clear values for next evaluations
			step.values = []
			// evaluate condition
			const conditionResult = condition.eval(context)
			if (context.token.isBreak) {
				return conditionResult
			}
			step.values.push(conditionResult)
		}
		return blockResult
	}
}
export class ForProcessEvaluator extends ProcessEvaluator {
	public eval (context: Context, step:Step): any {
		let lastValue:any = null
		const initialize = this.operand.children[0]
		const condition = this.operand.children[1]
		const increment = this.operand.children[2]
		const block = this.operand.children[3]

		// evaluate initialize
		if (step.values.length === 0) {
			const initializeResult = initialize.eval(context)
			if (context.token.isBreak) {
				return initializeResult
			}
			step.values.push(initializeResult)
		}
		// evaluate condition
		if (step.values.length === 1) {
			const conditionResult = condition.eval(context)
			if (context.token.isBreak) {
				return conditionResult
			}
			step.values.push(conditionResult)
		}

		while (step.values[1]) {
			// evaluate block
			if (step.values.length === 2) {
				lastValue = block.eval(context)
				if (context.token.isBreak) {
					return lastValue
				}
				step.values.push(lastValue)
			}
			// evaluate increment
			if (step.values.length === 3) {
				const incrementResult = increment.eval(context)
				if (context.token.isBreak) {
					return incrementResult
				}
				step.values.push(incrementResult)
			}
			// clear values for next evaluations
			step.values = [step.values[0]]
			// evaluate condition
			const conditionResult = condition.eval(context)
			if (context.token.isBreak) {
				return conditionResult
			}
			step.values.push(conditionResult)
		}
		return lastValue
	}
}
export class ForInProcessEvaluator extends ProcessEvaluator {
	public eval (context: Context, step:Step): any {
		let lastValue:any = null
		const item = this.operand.children[0]
		const list = this.operand.children[1]
		const block = this.operand.children[2]
		let listResult:any[] = []
		// evaluate list
		if (step.values.length === 0) {
			listResult = list.eval(context)
			if (context.token.isBreak) {
				return listResult
			}
			step.values.push(listResult)
		}
		for (let i = step.values.length - 1; i < listResult.length; i++) {
			const value = listResult[i]
			if (context) {
				context.data.set(item.name, value)
			}
			lastValue = block.eval(context)
			if (context.token.isBreak) {
				return lastValue
			}
			step.values.push(lastValue)
		}
		return lastValue
	}
}
export class SwitchProcessEvaluator extends ProcessEvaluator {
	public eval (context: Context, step:Step): any {
		// evaluate
		let value
		if (step.values.length === 0) {
			value = this.operand.children[0].eval(context)
			if (context.token.isBreak) {
				return value
			}
			step.values.push(value)
		} else {
			value = step.values[0]
		}
		for (let i = 1; i < this.operand.children.length; i++) {
			const option = this.operand.children[i]
			if (option.type === OperandType.Case) {
				if (option.name === value) {
					return option.children[0].eval(context)
				}
			} else if (option.type === OperandType.Default) {
				return option.children[0].eval(context)
			}
		}
	}
}
export class FuncProcessEvaluator extends ProcessEvaluator {
	public eval (): any {
		throw new Error('NotImplemented')
	}
}
export class TryProcessEvaluator extends Evaluator {
	public eval (): any {
		throw new Error('NotImplemented')
	}
}
export class CatchProcessEvaluator extends Evaluator {
	public eval (): any {
		throw new Error('NotImplemented')
	}
}
export class ThrowProcessEvaluator extends Evaluator {
	public eval (): any {
		throw new Error('NotImplemented')
	}
}