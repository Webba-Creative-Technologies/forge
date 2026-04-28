import { ReactNode, Children, cloneElement, isValidElement, ReactElement } from 'react'

interface ButtonGroupProps {
  children: ReactNode
  orientation?: 'horizontal' | 'vertical'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
}

export function ButtonGroup({
  children,
  orientation = 'horizontal',
  size,
  variant
}: ButtonGroupProps) {
  const isVertical = orientation === 'vertical'
  const items = Children.toArray(children).filter(isValidElement) as ReactElement<Record<string, unknown>>[]

  return (
    <div style={{
      display: 'flex',
      flexDirection: isVertical ? 'column' : 'row'
    }}>
      {items.map((child, index) => {
        const isFirst = index === 0
        const isLast = index === items.length - 1

        const overrideProps: Record<string, unknown> = {}
        if (size) overrideProps.size = size
        if (variant) overrideProps.variant = variant

        overrideProps.style = {
          ...(typeof child.props.style === 'object' ? child.props.style : {}),
          borderRadius: 0,
          ...(isFirst && !isVertical && { borderTopLeftRadius: 'var(--radius-sm)', borderBottomLeftRadius: 'var(--radius-sm)' }),
          ...(isFirst && isVertical && { borderTopLeftRadius: 'var(--radius-sm)', borderTopRightRadius: 'var(--radius-sm)' }),
          ...(isLast && !isVertical && { borderTopRightRadius: 'var(--radius-sm)', borderBottomRightRadius: 'var(--radius-sm)' }),
          ...(isLast && isVertical && { borderBottomLeftRadius: 'var(--radius-sm)', borderBottomRightRadius: 'var(--radius-sm)' }),
          ...(!isLast && !isVertical && { borderRight: 'none' }),
          ...(!isLast && isVertical && { borderBottom: 'none' })
        }

        return cloneElement(child, overrideProps)
      })}
    </div>
  )
}
