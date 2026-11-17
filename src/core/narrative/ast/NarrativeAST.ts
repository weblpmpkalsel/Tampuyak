import { ASTBuilder } from './ASTBuilder';
import { ASTSerializer } from './ASTSerializer';
import { ASTValidator, ValidationResult } from './ASTValidator';
import { IASTNode, IASTVisitor } from './ASTTypes';

export class NarrativeAST {
  private _builder: ASTBuilder;
  private _serializer: ASTSerializer;
  private _validator: ASTValidator;

  constructor() {
    this._builder = new ASTBuilder();
    this._serializer = new ASTSerializer();
    this._validator = new ASTValidator();
  }

  public get builder(): ASTBuilder {
    return this._builder;
  }

  public serialize(node: IASTNode, format: 'json' | 'compact' | 'debug' = 'json'): string {
    switch (format) {
      case 'compact': return this._serializer.toCompactJSON(node);
      case 'debug': return this._serializer.toDebugJSON(node);
      case 'json':
      default:
        return this._serializer.toJSON(node, 2);
    }
  }

  public validate(node: IASTNode): ValidationResult {
    return this._validator.validate(node);
  }

  public accept<T>(node: IASTNode, visitor: IASTVisitor<T>): T {
    return visitor.visitRoot(node);
  }
}
