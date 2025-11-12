import { useFormContext } from "@/lib/context/FormProvider"
import { themeColors } from "@/lib/utils"

const SummaryPreview = () => {
  const { formData } = useFormContext()

  return (
    <div>
      {formData?.summary && (
        <>
          <h3
            className="text-[15px] font-bold mb-2"
            style={{
              color: formData?.themeColor || themeColors[0],
            }}
          >
            Summary:
          </h3>
          <p className="text-xs text-justify">{formData?.summary}</p>
        </>
      )}
    </div>
  )
}

export default SummaryPreview
