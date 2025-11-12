import { useFormContext } from "@/lib/context/FormProvider"
import { themeColors } from "@/lib/utils"

const PROFICIENCY_LEVELS = [
  { value: 1, label: "Beginner", bgColor: "bg-blue-100", textColor: "text-blue-800" },
  { value: 2, label: "Intermediate", bgColor: "bg-yellow-100", textColor: "text-yellow-800" },
  { value: 3, label: "Advanced", bgColor: "bg-orange-100", textColor: "text-orange-800" },
  { value: 4, label: "Expert", bgColor: "bg-green-100", textColor: "text-green-800" },
]

const SkillsPreview = () => {
  const { formData } = useFormContext()

  const getProficiencyBadge = (rating: number) => {
    const level = PROFICIENCY_LEVELS.find((l) => l.value === rating) || PROFICIENCY_LEVELS[2]
    return level
  }

  return (
    <div className="my-6">
      <h2
        className="text-center font-bold text-sm mb-2"
        style={{
          color: formData?.themeColor || themeColors[0],
        }}
      >
        Skill{formData?.skills.length > 1 ? "s" : ""}
      </h2>
      <hr
        style={{
          borderColor: formData?.themeColor || themeColors[0],
        }}
      />

      <div className="flex flex-wrap gap-2 my-5">
        {formData?.skills.map((skill: any, index: number) => {
          const proficiency = getProficiencyBadge(skill?.rating || 3)
          return (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-2 rounded-full border border-gray-200 bg-gray-50"
            >
              <span className="text-xs font-semibold text-gray-700">{skill.name}</span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${proficiency.bgColor} ${proficiency.textColor}`}
              >
                {proficiency.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SkillsPreview
