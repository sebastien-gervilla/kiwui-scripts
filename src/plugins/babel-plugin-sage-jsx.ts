import { types, NodePath } from '@babel/core';
const { isJSXText, isJSXMemberExpression } = types;

const jsxPragma = 'Sage.createElement';

export default function sageJSXPlugin() {
    return {
        visitor: {
            Program: {
                enter(path: NodePath<types.Program>) {
                    let injected = false;

                    path.traverse({
                        JSXElement(path: NodePath<types.JSXElement>) {
                            if (!injected) {
                                // Inject import statement for the custom pragma
                                const importStatement = types.importDeclaration(
                                    [types.importNamespaceSpecifier(types.identifier("Sage"))],
                                    types.stringLiteral('sage')
                                );

                                // Add the import statement to the top-level scope
                                const programPath = path.findParent((p) => p.isProgram()) as NodePath<types.Program>;
                                if (programPath) {
                                    const clonedImportStatement = types.cloneNode(importStatement);
                                    (programPath.node.body as types.Statement[]).unshift(clonedImportStatement);
                                    injected = true;
                                }
                            }
                            
                            // Convert JSX element into a call to the custom pragma
                            const parentElement = generateJSXElement(path.node);
                            path.replaceWithSourceString(parentElement);
                        },
                    });
                },
            },
        },
    };
};

// Helper functions to generate attributes and children for the custom pragma
function generateAttributes(attributes: (types.JSXAttribute | types.JSXSpreadAttribute)[]): string {
    if (!attributes.length) return 'null';
    const attributeObjects: string[] = [];
  
    for (const attr of attributes) {
        if (types.isJSXSpreadAttribute(attr)) {
            // Handle spread attributes
            const spreadAttribute = generateSpreadAttribute(attr);
            attributeObjects.push(spreadAttribute);
        } else if (types.isJSXAttribute(attr)) {
            // Handle regular attributes
            const { name, value } = attr;
            const attributeName = types.isJSXIdentifier(name) ? name.name : name.namespace.name + ':' + name.name.name;
            const attributeValue = generateAttributeValue(value);
            attributeObjects.push(`"${attributeName}": ${attributeValue}`);
        }
    }
  
    return `{ ${attributeObjects.join(', ')} }`;
}

function generateAttributeValue(value: types.JSXAttribute['value']): string {
    if (types.isJSXExpressionContainer(value)) {
        // Handle JSX expression in attributes
        return types.isJSXEmptyExpression(value.expression) ? 'null' : generateExpression(value.expression);
    }
  
    if (types.isJSXElement(value)) {
      // Handle JSX element as attribute value
      return generateJSXElement(value);
    }
  
    if (types.isJSXFragment(value)) {
      // Handle JSX fragment as attribute value
      return generateJSXFragment(value);
    }
  
    // Handle literal values (e.g., strings, numbers, booleans)
    return types.isStringLiteral(value) ? `"${value.value}"` : `"${value}"`;
}

function generateSpreadAttribute(attr: types.JSXSpreadAttribute): string {
    // Handle spread attributes
    const expressionString = generateExpression(attr.argument);
    return `{ ...${expressionString} }`;
}
  
function generateExpression(expression: types.Expression | types.JSXEmptyExpression): string {
    if (types.isJSXEmptyExpression(expression)) {
      // Handle JSXEmptyExpression (e.g., <Component />)
      return '';
    }

    console.log('generate:', expression);

    if (types.isCallExpression(expression) && expression.callee.type == 'Identifier')
        return `${expression.callee.name}()`;

    if (types.isIdentifier(expression))
        return `\"${expression.name}\"`;
  
    // Handle other JSX expressions
    return ''
} 

function generateJSXElement(element: types.JSXElement): string {
    const { openingElement } = element;
    const attributes = generateAttributes(openingElement.attributes);

    console.log("=============================================================");
    console.log("Main element:", element.openingElement);
    console.log("=============================================================");
    
    
    let transformedJSX = jsxPragma;
    if (isJSXMemberExpression(openingElement.name)) {
        const tagName = openingElement.name.property.name;
        transformedJSX += `(${tagName}, ${attributes}`;
    } else {
        const tagName = openingElement.name.name.toString();
        if (isFirstCharacterUppercase(tagName))
            return `Button(${attributes})`

        transformedJSX += `("${tagName}", ${attributes}`;
    }

    const children = generateChildren(element.children);
    transformedJSX += children ? `, ${children})` : ')';

    return transformedJSX;
}



function generateJSXFragment(fragment: types.JSXFragment): string {
    // Handle JSX fragment
    const children = generateChildren(fragment.children);
    return `[${children}]`;
}
  
function generateChildren(children: types.Node[]): string | null {
    if (!children.length) return null;

    // Handle JSX children
    const childrenStrings = children.map(child => {
        if (isJSXText(child)) {
            const purified = purifyJSXText(child.value);
            return purified ? `\"${purified}\"` : null;
        }

        if (types.isJSXExpressionContainer(child))
            return generateExpression(child.expression);
            
        if (types.isJSXElement(child)) {
            return generateJSXElement(child);
        } else if (types.isJSXFragment(child)) {
            return generateJSXFragment(child);
        }

        return ''; // TODO: filter to prevent this
    }).filter(Boolean);

    if (!childrenStrings.length)
        return null;
  
    return childrenStrings.join(', ');
}

const purifyJSXText = (text: string) => {
    return text
        .replace(/(\r\n|\n|\r|\t)/gm,"")
        .trim();
}

function isFirstCharacterUppercase(text: string) {
    return text.charAt(0) === text.charAt(0).toUpperCase();
}