'use client'

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
          borderColor: 'E2E8F0',
          ':hover': {
            borderColor: '#E2E8F0',
          },
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
