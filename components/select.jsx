'use client'

import { useTheme } from 'next-themes'
import { useMemo } from 'react'
import CreateableSelect from 'react-select/creatable'

const Select = ({
  onChange,
  onCreate,
  options = [],
  disabled,
  value,
  placeholder,
}) => {
  const { theme } = useTheme()

  const onSelect = (option) => {
    onChange(option?.value)
  }

  const formattedValue = useMemo(() => {
    return options.find((option) => option.value === value)
  }, [options, value])

  return (
    <CreateableSelect
      placeholder={placeholder}
      className="text-sm h-10"
      styles={{
        control: (base) => ({
          ...base,
          borderColor: '#E2E8F0',
          backgroundColor: theme === 'black' ? 'black' : 'inherit',
          ':hover': {
            borderColor: '#E2E8F0',
          },
        }),
        option: (provided, state) => ({
          ...provided,
          color: theme === 'black' ? 'white' : 'black',
        }),
      }}
      value={formattedValue}
      options={options}
      onChange={onSelect}
      onCreateOption={onCreate}
      isDisabled={disabled}
    />
  )
}

export default Select
