import FormItem from 'antd/es/form/FormItem';
import {
  default as FormAntd, FormComponentProps, ComponentDecorator, FormCreateOption, WrappedFormUtils
} from 'antd/es/form/Form';

export interface FormComponentProps {
  form?: WrappedFormUtils;
}
type T = Omit<P, keyof FormComponentProps> & TOwnProps;
export interface ComponentDecorator<TOwnProps> {
  <P extends FormComponentProps>(component: React.ComponentClass<P>):
    React.ComponentClass<T>;
}
export default class Form extends FormAntd {
  static Item: typeof FormItem;
  static create: <TOwnProps>(options?: FormCreateOption<TOwnProps>) => ComponentDecorator<TOwnProps>;
}