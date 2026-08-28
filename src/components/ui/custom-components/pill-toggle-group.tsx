import type { VariantProps } from "class-variance-authority";
import { motion, Reorder } from "motion/react";
import {
  Children,
  type ComponentProps,
  cloneElement,
  createContext,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Toggle, type toggleVariants } from "#ui/toggle";
import { cn } from "@/lib/utils";

const TOGGLE_SPRING = {
  type: "spring" as const,
  bounce: 0.2,
};

const TOGGLE_GAP = 8;

const PILL_RADIUS = 24;

const itemClassName =
  "w-full rounded-none text-xs px-2 data-[state=on]:bg-foreground data-[state=on]:text-background data-[state=on]:border-muted";

type ToggleItemMeta = {
  id: string;
  disabled: boolean;
};

function clusterToggleOrder(
  items: ToggleItemMeta[],
  activeIds: string[],
): string[] {
  const order = items.map((item) => item.id);
  const disabledIds = new Set(
    items.filter((item) => item.disabled).map((item) => item.id),
  );
  const activeSet = new Set(activeIds);

  const isAvailable = (id: string) => !disabledIds.has(id);

  const availableActive = activeIds.filter((id) => isAvailable(id));
  const availableInactive = order.filter(
    (id) => isAvailable(id) && !activeSet.has(id),
  );
  const unavailable = order.filter((id) => !isAvailable(id));

  return [...availableActive, ...availableInactive, ...unavailable];
}

function getToggleMarginLeft(
  index: number,
  displayOrder: string[],
  activeIds: string[],
): number {
  if (index === 0) {
    return 0;
  }

  const id = displayOrder[index];
  const prevId = displayOrder[index - 1];
  const isActive = activeIds.includes(id);
  const prevActive = activeIds.includes(prevId);

  if (isActive && prevActive) {
    return 0;
  }

  return TOGGLE_GAP;
}

function getToggleRadiusAnimation(
  isActive: boolean,
  connectLeft: boolean,
  connectRight: boolean,
) {
  if (!isActive) {
    return {
      borderTopLeftRadius: PILL_RADIUS,
      borderTopRightRadius: PILL_RADIUS,
      borderBottomLeftRadius: PILL_RADIUS,
      borderBottomRightRadius: PILL_RADIUS,
      borderLeftWidth: "1px",
    };
  }

  if (connectLeft && connectRight) {
    return {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      borderLeftWidth: "0px",
    };
  }

  if (connectLeft) {
    return {
      borderTopLeftRadius: 0,
      borderTopRightRadius: PILL_RADIUS,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: PILL_RADIUS,
      borderLeftWidth: "0px",
    };
  }

  if (connectRight) {
    return {
      borderTopLeftRadius: PILL_RADIUS,
      borderTopRightRadius: 0,
      borderBottomLeftRadius: PILL_RADIUS,
      borderBottomRightRadius: 0,
      borderLeftWidth: "1px",
    };
  }

  return {
    borderTopLeftRadius: PILL_RADIUS,
    borderTopRightRadius: PILL_RADIUS,
    borderBottomLeftRadius: PILL_RADIUS,
    borderBottomRightRadius: PILL_RADIUS,
    borderLeftWidth: "1px",
  };
}

type ToggleGroupContextValue = VariantProps<typeof toggleVariants> & {
  type: "single" | "multiple";
  value: string[];
  onValueChange: (value: string[]) => void;
  groupDisabled: boolean;
  displayOrder: string[];
  disabledValues: ReadonlySet<string>;
};

const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null);

function useToggleGroupContext() {
  const context = useContext(ToggleGroupContext);
  if (!context) {
    throw new Error("ToggleGroupItem must be used within ToggleGroup");
  }
  return context;
}

type ToggleGroupDomProps = Omit<
  ComponentProps<"div">,
  | "children"
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onDragOver"
  | "onDragEnter"
  | "onDragLeave"
  | "onDragExit"
  | "onDrop"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
  | "onTransitionEnd"
>;

type ToggleGroupSharedProps = ToggleGroupDomProps &
  VariantProps<typeof toggleVariants> & {
    disabled?: boolean;
    children: ReactNode;
  };

type ToggleGroupSingleProps<T extends string> = ToggleGroupSharedProps & {
  type: "single";
  value: T | "";
  onValueChange: (value: T | "") => void;
};

type ToggleGroupMultipleProps<T extends string> = ToggleGroupSharedProps & {
  type?: "multiple";
  value: T[];
  onValueChange: (value: T[]) => void;
};

type ToggleGroupImplProps<T extends string> = ToggleGroupSharedProps & {
  type?: "single" | "multiple";
  value: T | "" | T[];
  onValueChange: ((value: T | "") => void) | ((value: T[]) => void);
};

function getToggleGroupItem(
  child: ReactNode,
): ReactElement<ToggleGroupItemProps> | null {
  if (!isValidElement(child)) {
    return null;
  }

  const props = child.props as Partial<ToggleGroupItemProps>;
  if (typeof props.value !== "string") {
    return null;
  }

  return child as ReactElement<ToggleGroupItemProps>;
}

function toSelectedIds(
  type: "single" | "multiple",
  value: string | readonly string[],
): string[] {
  if (type === "single") {
    return value ? [value as string] : [];
  }

  return [...(value as readonly string[])];
}

function ToggleGroup<T extends string>(
  props: ToggleGroupSingleProps<T>,
): ReactNode;
function ToggleGroup<T extends string>(
  props: ToggleGroupMultipleProps<T>,
): ReactNode;
function ToggleGroup<T extends string>({
  type = "multiple",
  value,
  onValueChange,
  disabled = false,
  className,
  children,
  variant = "outline",
  size = "sm",
  ...groupProps
}: ToggleGroupImplProps<T>) {
  const selected = toSelectedIds(type, value);

  const emitValueChange = (next: string[]) => {
    if (type === "single") {
      (onValueChange as (nextValue: T | "") => void)((next[0] ?? "") as T | "");
      return;
    }

    (onValueChange as (nextValue: T[]) => void)(next as T[]);
  };

  const items = Children.toArray(children)
    .map(getToggleGroupItem)
    .filter(
      (item): item is ReactElement<ToggleGroupItemProps> => item !== null,
    );

  const itemMeta = items.map((item) => ({
    id: item.props.value,
    disabled: Boolean(item.props.disabled),
  }));

  const clusteredOrder = clusterToggleOrder(itemMeta, selected);

  const [displayOrder, setDisplayOrder] = useState(clusteredOrder);

  useEffect(() => {
    setDisplayOrder((prev) => {
      const next = clusteredOrder;
      return prev.join() === next.join() ? prev : next;
    });
  }, [clusteredOrder]);

  const disabledValues = new Set(
    itemMeta.filter((item) => item.disabled).map((item) => item.id),
  );

  const itemsByValue = new Map(
    items.map((item) => [item.props.value, item] as const),
  );

  return (
    <ToggleGroupContext.Provider
      value={{
        type,
        value: selected,
        onValueChange: emitValueChange,
        groupDisabled: disabled,
        displayOrder,
        disabledValues,
        variant,
        size,
      }}
    >
      <Reorder.Group
        role="group"
        aria-disabled={disabled || undefined}
        {...groupProps}
        as="div"
        axis="x"
        values={displayOrder}
        onReorder={setDisplayOrder}
        className={cn("flex w-full items-stretch", className)}
      >
        {displayOrder.map((id) => {
          const item = itemsByValue.get(id);
          return item ? cloneElement(item, { key: id }) : null;
        })}
      </Reorder.Group>
    </ToggleGroupContext.Provider>
  );
}

type ToggleGroupItemProps = Omit<
  ComponentProps<typeof Toggle>,
  "pressed" | "defaultPressed" | "onPressedChange" | "asChild" | "type"
> & {
  value: string;
};

function ToggleGroupItem({
  value,
  disabled = false,
  className,
  children,
  variant,
  size,
  ...itemProps
}: ToggleGroupItemProps) {
  const {
    type,
    value: selected,
    onValueChange,
    groupDisabled,
    displayOrder,
    disabledValues,
    variant: groupVariant,
    size: groupSize,
  } = useToggleGroupContext();

  const index = displayOrder.indexOf(value);
  const isActive = selected.includes(value);
  const isAvailable = !disabled;
  const prevId = displayOrder[index - 1];
  const nextId = displayOrder[index + 1];

  const connectLeft =
    isActive &&
    isAvailable &&
    prevId !== undefined &&
    selected.includes(prevId) &&
    !disabledValues.has(prevId);

  const connectRight =
    isActive &&
    isAvailable &&
    nextId !== undefined &&
    selected.includes(nextId) &&
    !disabledValues.has(nextId);

  return (
    <Reorder.Item
      value={value}
      as="div"
      dragListener={false}
      transition={TOGGLE_SPRING}
      className="flex min-w-0 flex-1 list-none"
      style={{
        marginLeft: getToggleMarginLeft(index, displayOrder, selected),
      }}
    >
      <Toggle
        asChild
        {...itemProps}
        variant={groupVariant ?? variant ?? "outline"}
        size={groupSize ?? size ?? "sm"}
        pressed={isActive}
        disabled={!isAvailable || groupDisabled}
        onPressedChange={(pressed) => {
          if (type === "single") {
            onValueChange(pressed ? [value] : []);
            return;
          }

          if (pressed) {
            onValueChange(
              selected.includes(value) ? selected : [...selected, value],
            );
            return;
          }

          onValueChange(selected.filter((id) => id !== value));
        }}
      >
        <motion.button
          type="button"
          initial={false}
          animate={getToggleRadiusAnimation(
            isActive,
            connectLeft,
            connectRight,
          )}
          transition={TOGGLE_SPRING}
          className={cn(itemClassName, className)}
        >
          {children}
        </motion.button>
      </Toggle>
    </Reorder.Item>
  );
}

export { ToggleGroup, ToggleGroupItem };
