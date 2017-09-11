// 奇怪只有 import 这个就不会错
import * as React from 'react';
import FormItem from 'antd/es/form/FormItem';
import { FormProps, FormCreateOption, WrappedFormUtils } from 'antd/es/form/Form';

declare module 'antd' {
  export interface FormComponentProps {
    form: WrappedFormUtils;
  }
  type Diff<T extends string, U extends string> = (
    { [P in T]: P }
    & { [P in U]: never }
    & { [x: string]: T }
    )[T];
  type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>;
  interface ComponentDecorator<TOwnProps> {
    <P extends FormComponentProps>(component: React.ComponentClass<P>):
      React.ComponentClass<Omit<P, keyof FormComponentProps>>;
  }
  export class Form extends React.Component<FormProps, any> {
    constructor(props: any);
    static Item: typeof FormItem;
    static create: <TOwnProps>(options?: FormCreateOption<TOwnProps>) => ComponentDecorator<TOwnProps>;
  }
}