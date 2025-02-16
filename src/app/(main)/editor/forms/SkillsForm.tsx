import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { EditorFormProps } from "@/lib/types";
import { skillsSchema, SkillsValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DndContext,
  useSensors,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { verticalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { closestCenter } from "@dnd-kit/core";
import { GripVertical } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

export default function SkillsForm({
  resumeData,
  setResumeData,
}: EditorFormProps) {
  const form = useForm<SkillsValues>({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      skills: resumeData.skills || [
        { title: "Skills", skillItems: [] as string[] },
      ],
    },
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;
      setResumeData({
        ...resumeData,
        skills:
          values.skills
            ?.filter((skillGroup) => skillGroup !== undefined)
            .map((skillGroup) => ({
              title: skillGroup.title?.trim() || "",
              skillItems:
                skillGroup.skillItems
                  ?.map((item) => item?.trim())
                  .filter((item): item is string => item !== "") || [],
            }))
            .filter((skillGroup) => skillGroup.skillItems.length > 0) || [],
      });
    });
    return unsubscribe;
  }, [form, resumeData, setResumeData]);

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "skills",
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over.id);
      move(oldIndex, newIndex);
      return arrayMove(fields, oldIndex, newIndex);
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Skills</h2>
        <p className="text-sm text-muted-foreground">
          Group your skills by category
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-3">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={fields}
              strategy={verticalListSortingStrategy}
            >
              {fields.map((field, index) => (
                <SkillGroupItem
                  key={field.id}
                  id={field.id}
                  index={index}
                  form={form}
                  remove={remove}
                />
              ))}
            </SortableContext>
          </DndContext>
          <div className="flex justify-center">
            <Button
              type="button"
              onClick={() => append({ title: "", skillItems: [] })}
            >
              Add Skill Category
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

interface SkillGroupItemProps {
  id: string;
  form: UseFormReturn<SkillsValues>;
  index: number;
  remove: (index: number) => void;
}

function SkillGroupItem({ id, form, index, remove }: SkillGroupItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(
        "space-y-3 rounded-md border bg-background p-3",
        isDragging && "relative z-50 cursor-grab shadow-xl",
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GripVertical
            className="size-4 cursor-grab text-muted-foreground"
            {...attributes}
            {...listeners}
          />
          <span className="font-semibold">Skill Group {index + 1}</span>
        </div>
        <Button
          variant="destructive"
          size="sm"
          type="button"
          onClick={() => remove(index)}
        >
          Remove Group
        </Button>
      </div>
      <FormField
        control={form.control}
        name={`skills.${index}.title`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category Title</FormLabel>
            <FormControl>
              <Input {...field} placeholder="e.g. Programming Languages" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`skills.${index}.skillItems`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Skills</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="e.g. Python, Java, C++"
                onChange={(e) => {
                  const items = e.target.value
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean);
                  field.onChange(items);
                }}
                value={field.value?.join(", ")}
              />
            </FormControl>
            <FormDescription>Separate each skill with a comma</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
