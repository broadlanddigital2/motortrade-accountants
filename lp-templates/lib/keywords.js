export const marginVariants = {
 'margin-scheme-accountants': ['VAT Margin Scheme Accountants for Car Dealers', 'Get your free margin scheme check'],
 'vat-margin-scheme': ['Getting the VAT Margin Scheme Right on Used Cars', 'Check your margin scheme VAT for free'],
 'second-hand': ['Second-Hand Car Margin Scheme: Is Your VAT Right?', 'Get your free margin scheme check'],
};
export function locationProps(value) {
 const kw = value === 'automotive' ? 'automotive' : 'motor-trade';
 return {kw, keyword:kw === 'automotive' ? 'Automotive' : 'Motor Trade', formHeading:kw === 'automotive' ? 'Your free automotive discovery call' : 'Book your free discovery call'};
}
export function marginProps(value) {
 const kw = typeof value === 'string' && Object.hasOwn(marginVariants,value) ? value : 'margin-scheme-accountants';
 const [heading,formHeading] = marginVariants[kw];
 return {kw, heading, formHeading};
}
