import { Type, IModelManager, Context, Operand, Evaluator } from '../contract'
import { typeHelper } from '.'
import { h3lp } from 'h3lp'

export class ConstEvaluator extends Evaluator {
	public eval (): any {
		switch (this.operand.type) {
		case 'string':
			return this.operand.name
		case 'boolean':
			return Boolean(this.operand.name)
		case 'number':
			return parseFloat(this.operand.name)
		default:
			return this.operand.name
		}
	}
}

export class Const extends Operand {
	constructor (id: string, name: string) {
		super(id, name, [], typeHelper.getType(name))
		this.evaluator = new ConstEvaluator(this)
	}
}

// export class Variable extends Operand implements IOperandData
export class VarEvaluator extends Evaluator {
	public eval (context: Context): any {
		return context.data.get(this.operand.name)
	}
}

export class Var extends Operand {
	public number?: number
	constructor (id: string, name: string, type?:Type) {
		super(id, name, [], type)
		this.evaluator = new VarEvaluator(this)
	}
}

export class EnvEvaluator extends Evaluator {
	public eval (): any {
		return process.env[this.operand.name]
	}
}

export class Env extends Operand {
	constructor (id: string, name: string) {
		super(id, name, [], 'string')
		this.evaluator = new EnvEvaluator(this)
	}
}

export class TemplateEvaluator extends Evaluator {
	public eval (context: Context): any {
		// info https://www.tutorialstonight.com/javascript-string-format.php
		const result = this.operand.name.replace(/\$([a-zA-Z0-9_]+)/g, (match, field) => {
			const value = process.env[field]
			return typeof value === 'undefined' ? match : value
		})
		return result.replace(/\${([a-zA-Z0-9_.]+)}/g, (match, field) => {
			if (context.data) {
				const value = context.data.get(field)
				return typeof value === 'undefined' ? match : value
			}
		})
	}
}

export class Template extends Operand {
	constructor (id: string, name: string) {
		super(id, name, [], 'string')
		this.evaluator = new TemplateEvaluator(this)
	}
}

export class PropertyEvaluator extends Evaluator {
	public eval (context: Context): any {
		const value = this.operand.children[0].eval(context)
		if (value === undefined || value === null) return null
		return h3lp.obj.getValue(value, this.operand.name)
	}
}

export class Property extends Operand {
	constructor (id: string, name: string, children: Operand[] = [], type?:Type) {
		super(id, name, children, type)
		this.evaluator = new PropertyEvaluator(this)
	}
}

export class KeyValEvaluator extends Evaluator {
	public eval (context: Context): any {
		return this.operand.children[0].eval(context)
	}
}

export class KeyVal extends Operand {
	public property?: string
	constructor (id: string, name: string, children: Operand[] = [], property: string, type?: Type) {
		super(id, name, children, type)
		this.property = property
		this.evaluator = new KeyValEvaluator(this)
	}
}

export class ListEvaluator extends Evaluator {
	public eval (context: Context): any {
		const values = []
		for (let i = 0; i < this.operand.children.length; i++) {
			values.push(this.operand.children[i].eval(context))
		}
		return values
	}
}

export class List extends Operand {
	constructor (id: string, name: string, children: Operand[] = []) {
		super(id, name, children)
		this.evaluator = new ListEvaluator(this)
	}
}

export class ObjEvaluator extends Evaluator {
	public eval (context: Context): any {
		const obj: { [k: string]: any } = {}
		for (const child of this.operand.children) {
			obj[child.name] = child.eval(context)
		}
		return obj
	}
}

export class Obj extends Operand {
	constructor (id: string, name: string, children: Operand[] = []) {
		super(id, name, children)
		this.evaluator = new ObjEvaluator(this)
	}
}

export class OperatorEvaluator extends Evaluator {
	private model: IModelManager
	constructor (operand: Operand, model: IModelManager) {
		super(operand)
		this.model = model
	}

	public eval (context: Context): any {
		if (this.model) {
			const operatorMetadata = this.model.getOperator(this.operand.name, this.operand.children.length)
			if (operatorMetadata.custom) {
				// eslint-disable-next-line new-cap
				return new operatorMetadata.custom(this.operand.name, this.operand.children).eval(context)
			} else {
				const args = []
				for (const child of this.operand.children) {
					args.push(child.eval(context))
				}
				return operatorMetadata.function(...args)
			}
		} else {
			throw new Error(`Function ${this.operand.name} not implemented`)
		}
	}
}

export class Operator extends Operand { }

export class CallFuncEvaluator extends Evaluator {
	private model: IModelManager
	constructor (operand: Operand, model: IModelManager) {
		super(operand)
		this.model = model
	}

	public eval (context: Context): any {
		if (this.model) {
			const funcMetadata = this.model.getFunction(this.operand.name)
			if (funcMetadata.custom) {
				// eslint-disable-next-line new-cap
				return new funcMetadata.custom(this.operand.name, this.operand.children).eval(context)
			} else if (funcMetadata.function) {
				const args = []
				for (let i = 0; i < this.operand.children.length; i++) {
					args.push(this.operand.children[i].eval(context))
				}
				return funcMetadata.function(...args)
			}
		} else {
			throw new Error(`Function ${this.operand.name} not implemented`)
		}
	}
}

export class CallFunc extends Operand { }

export class ChildFunc extends CallFunc {
}
export class Arrow extends CallFunc {
}

export class BlockEvaluator extends Evaluator {
	public eval (context: Context): any {
		let lastValue:any = null
		for (let i = 0; i < this.operand.children.length; i++) {
			lastValue = this.operand.children[i].eval(context)
		}
		return lastValue
	}
}

export class Block extends Operand { }

export class IfEvaluator extends Evaluator {
	public eval (context: Context): any {
		const condition = this.operand.children[0].eval(context)
		if (condition) {
			const ifBlock = this.operand.children[1]
			return ifBlock.eval(context)
		} else if (this.operand.children.length > 2) {
			for (let i = 2; i < this.operand.children.length; i++) {
				if (this.operand.children[i] instanceof ElseIf) {
					const elseIfCondition = this.operand.children[i].children[0].eval(context)
					if (elseIfCondition) {
						const elseIfBlock = this.operand.children[i].children[1]
						return elseIfBlock.eval(context)
					}
				} else {
					const elseBlock = this.operand.children[i]
					return elseBlock.eval(context)
				}
			}
		}
	}
}

export class If extends Operand { }
export class ElseIf extends Operand { }
export class Else extends Operand { }

export class WhileEvaluator extends Evaluator {
	public eval (context: Context): any {
		let lastValue:any = null
		const condition = this.operand.children[0]
		const block = this.operand.children[1]
		while (condition.eval(context)) {
			lastValue = block.eval(context)
		}
		return lastValue
	}
}
export class While extends Operand {
	constructor (id: string, name: string, children: Operand[] = []) {
		super(id, name, children)
		this.evaluator = new WhileEvaluator(this)
	}
}

export class ForEvaluator extends Evaluator {
	public eval (context: Context): any {
		let lastValue:any = null
		const initialize = this.operand.children[0]
		const condition = this.operand.children[1]
		const increment = this.operand.children[2]
		const block = this.operand.children[3]
		for (initialize.eval(context); condition.eval(context); increment.eval(context)) {
			lastValue = block.eval(context)
		}
		return lastValue
	}
}
export class For extends Operand {
	constructor (id: string, name: string, children: Operand[] = []) {
		super(id, name, children)
		this.evaluator = new ForEvaluator(this)
	}
}

export class ForInEvaluator extends Evaluator {
	public eval (context: Context): any {
		let lastValue:any = null
		const item = this.operand.children[0]
		const list = this.operand.children[1].eval(context)
		const block = this.operand.children[2]
		for (let i = 0; i < list.length; i++) {
			const value = list[i]
			if (context) {
				context.data.set(item.name, value)
			}
			// item.set(value)
			lastValue = block.eval(context)
		}
		return lastValue
	}
}

export class ForIn extends Operand {
	constructor (id: string, name: string, children: Operand[] = []) {
		super(id, name, children)
		this.evaluator = new ForInEvaluator(this)
	}
}

export class SwitchEvaluator extends Evaluator {
	public eval (context: Context): any {
		const value = this.operand.children[0].eval(context)
		for (let i = 1; i < this.operand.children.length; i++) {
			const option = this.operand.children[i]
			if (option instanceof Case) {
				if (option.name === value) {
					const caseBlock = option.children[0]
					return caseBlock.eval(context)
				}
			} else if (option instanceof Default) {
				const defaultBlock = option.children[0]
				return defaultBlock.eval(context)
			}
		}
	}
}
export class Switch extends Operand { }
export class Case extends Operand { }
export class Default extends Operand { }

export class BreakEvaluator extends Evaluator {
	public eval (): any {
		throw new Error('NotImplemented')
	}
}

export class Break extends Operand { }

export class ContinueEvaluator extends Evaluator {
	public eval (): any {
		throw new Error('NotImplemented')
	}
}

export class Continue extends Operand { }

export class FuncEvaluator extends Evaluator {
	public eval (): any {
		throw new Error('NotImplemented')
	}
}

export class Func extends Operand { }

export class ReturnEvaluator extends Evaluator {
	public eval (): any {
		throw new Error('NotImplemented')
	}
}
export class Return extends Operand { }

export class TryEvaluator extends Evaluator {
	public eval (): any {
		throw new Error('NotImplemented')
	}
}

export class Try extends Operand { }

export class CatchEvaluator extends Evaluator {
	public eval (): any {
		throw new Error('NotImplemented')
	}
}
export class Catch extends Operand { }

export class ThrowEvaluator extends Evaluator {
	public eval (): any {
		throw new Error('NotImplemented')
	}
}

export class Throw extends Operand { }
