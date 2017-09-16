import * as React from 'react';
import FormItem from 'antd/es/form/FormItem';
import { FormProps, FormCreateOption, WrappedFormUtils }
  from 'antd/es/form/Form';

declare module 'antd' {
  import { BasePageProps } from '../src/pages/abstract/BasePage';
  export interface FormComponentProps {
    form?: WrappedFormUtils;
  }
  interface ComponentDecorator<TOwnProps> {
    <P extends FormComponentProps>(component: React.ComponentClass<P>):
      React.ComponentSpec<BasePageProps>;
  }

  export class Form extends React.Component<FormProps, any> {
    constructor(props: any);
    static Item: typeof FormItem;
    static create: <TOwnProps>(options?: FormCreateOption<TOwnProps>)
      => ComponentDecorator<TOwnProps>;
  }
}