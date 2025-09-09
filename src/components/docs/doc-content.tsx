import { DocContent, DocContentComponentProps } from "~/constants/docs";
import AlertBox from "~/components/ui/alert-box";
import CodeBlock from "~/components/ui/code-block";

export default function DocContentComponent({ content }: DocContentComponentProps) {
  return (
    <div className="prose max-w-none">
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-3 lg:mb-4">
          {content.title}
        </h1>
        <p className="text-base lg:text-lg text-gray-600 leading-relaxed">
          {content.description}
        </p>
      </div>

      {content.alerts && content.alerts.length > 0 && (
        <div className="mb-6 lg:mb-8 space-y-4">
          {content.alerts.map((alert, index) => (
        <AlertBox
          key={index}
          type={alert.type}
          title={alert.title}
          content={alert.content}
        />
      ))}
        </div>
      )}

      <div className="space-y-6 lg:space-y-8">
      {content.sections.map((section, sectionIndex) => (
          <section key={sectionIndex} className="space-y-4 lg:space-y-6">
            <h2 className="text-xl lg:text-2xl font-semibold text-gray-900">
            {section.title}
          </h2>
          
            <div className="text-sm lg:text-base text-gray-700 leading-relaxed">
              {section.content}
            </div>

            {section.sections && (
              <div className="space-y-4 lg:space-y-6">
                {section.sections.map((subsection, subsectionIndex) => (
                  <div key={subsectionIndex} className="space-y-3 lg:space-y-4">
                    <h3 className="text-lg lg:text-xl font-medium text-gray-900">
                      {subsection.title}
              </h3>
              
                    <div className="text-sm lg:text-base text-gray-700 leading-relaxed">
                      {subsection.content}
                    </div>

                    {subsection.codeBlocks && (
                      <div className="space-y-3 lg:space-y-4">
                        {subsection.codeBlocks.map((codeBlock, codeIndex) => (
                <CodeBlock
                  key={codeIndex}
                  code={codeBlock.code}
                  title={codeBlock.title}
                />
              ))}
                      </div>
                    )}

                    {subsection.lists && (
                      <ul className="list-disc list-inside space-y-1 lg:space-y-2 text-sm lg:text-base text-gray-700">
                        {subsection.lists.map((item, itemIndex) => (
                          <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              )}

                    {subsection.gridItems && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                        {subsection.gridItems.map((item, itemIndex) => (
                          <div key={itemIndex} className="p-4 lg:p-6 bg-gray-50 rounded-lg border border-gray-200">
                            <h4 className="font-medium text-gray-900 mb-2">{item.title}</h4>
                            <p className="text-sm lg:text-base text-gray-600">{item.description}</p>
                    </div>
                  ))}
                </div>
              )}

                    {subsection.additionalContent && (
                      <div className="text-sm lg:text-base text-gray-700 leading-relaxed">
                        {subsection.additionalContent}
            </div>
          )}
                </div>
              ))}
            </div>
          )}
          </section>
              ))}
            </div>
        </div>
  );
} 