/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { TextInputProps } from 'react-native';
import { useField } from '@unform/core';
import { Picker } from '@react-native-community/picker';
import { Container, TextInput, Icon } from './styles';

interface InputProps extends TextInputProps {
  name: string;
  icon: string;
  containerStyle?: {};
  list: Object[];
}

interface InputValueReference {
  value: string;
}

interface InputRef {
  focus(): void;
}

const Select: React.ForwardRefRenderFunction<InputRef, InputProps> = (
  { name, icon, containerStyle = {}, ...rest },
  ref,
) => {
  const inputElementRef = useRef<any>(null);

  const { registerField, defaultValue = '', fieldName, error } = useField(name);
  const inputValueRef = useRef<InputValueReference>({ value: defaultValue });

  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);

    setIsFilled(!!inputValueRef.current.value);
  }, []);

  useImperativeHandle(ref, () => ({
    focus() {
      inputElementRef.current?.focus();
    },
  }));

  useEffect(() => {
    registerField<string>({
      name: fieldName,
      ref: inputValueRef.current,
      path: 'value',
      setValue(ref: any, value) {
        inputValueRef.current.value = value;
        inputElementRef.current.setNativeProps({ text: value });
      },
      clearValue() {
        inputValueRef.current.value = '';
        inputElementRef.current.clear();
      },
    });
  }, [fieldName, registerField]);

  return (
    <Container style={containerStyle} isFocused={isFocused} isErrored={!!error}>
      {/* <Icon
        name={icon}
        size={16}
        color={isFocused || isFilled ? '#f76769' : '#f1faee'}
      /> */}

      <TextInput
        ref={inputElementRef}
        keyboardAppearance="dark"
        placeholderTextColor="#f1faee"
        defaultValue={defaultValue}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onChangeText={value => {
          inputValueRef.current.value = value;
        }}
        {...rest}
      >
        {/* <Picker
          selectedValue={cursoEscolhido}
          onValueChange={itemValue => setCursoEscolhido(itemValue)}
          style={{ width: 100 }}
        >
          {cursos.map(curso => {
            return (
              <Picker.Item
                key={curso.id}
                label={curso.nome}
                value={curso.nome}
              />
            );
          })}
        </Picker> */}
      </TextInput>
    </Container>
  );
};

export default forwardRef(Select);