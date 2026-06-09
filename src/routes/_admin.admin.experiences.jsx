
import { CrudPage } from "@/components/admin/CrudPage";
import { api } from "@/api/client";

const __PageComponent = () => (
    <CrudPage
      title="Experiences"
      subtitle="Academic & professional positions"
      queryKey="admin-exp"
      api={api.experiences       }
      columns={[
        { key: "position", label: "Position", render: (r     ) => <span className="font-medium text-foreground">{r.position}</span> },
        { key: "organization", label: "Organization" },
        { key: "from", label: "From" },
        { key: "to", label: "To" },
      ]}
      fields={[
        { name: "position", label: "Position" },
        { name: "organization", label: "Organization" },
        { name: "from", label: "From (year)" },
        { name: "to", label: "To (year)" },
        { name: "description", label: "Description", type: "textarea" },
      ]}
      defaults={{ position: "", organization: "", from: "", to: "" }}
    />
  );

export default __PageComponent;
