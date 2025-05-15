import { useFormContext } from "@/lib/context/FormProvider"
import { themeColors } from "@/lib/utils"

const ProjectPreview = () => {
  const { formData } = useFormContext()

  return (
    <div className="my-6">
      <h2
        className="text-center font-bold text-sm mb-2"
        style={{
          color: formData?.themeColor || themeColors[0],
        }}
      >
        Projects
      </h2>
      <hr
        style={{
          borderColor: formData?.themeColor || themeColors[0],
        }}
      />

      {formData?.project?.map((project: any, index: number) => (
        <div key={index} className="my-5">
          <div className="flex justify-between items-center">
            <h2
              className="text-sm font-bold"
              style={{
                color: formData?.themeColor || themeColors[0],
              }}
            >
              {project?.title}
            </h2>
            <span className="text-xs">
              {project?.startDate}
              {project?.startDate && (project?.endDate || project?.endDate === "") && " to "}
              {project?.startDate && project?.endDate == "" ? "Present" : project.endDate}
            </span>
          </div>

          <h2 className="text-xs">
            {project?.technologies}
            {project?.technologies && project?.projectLink && " - "}
            {project?.projectLink && (
              <a
                href={project?.projectLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 font-semibold hover:underline"
              >
                Link
              </a>
            )}
          </h2>

          {project?.projectSummary && (
            <div
              className="text-xs my-2 form-preview"
              dangerouslySetInnerHTML={{
                __html: project?.projectSummary,
              }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default ProjectPreview
