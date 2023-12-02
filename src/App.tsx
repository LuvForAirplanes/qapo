import "./App.css";
import { Button, Card, Divider, IconButton, Input, Tab, TabList, TabPanel, Tabs } from "@mui/joy";
import { Project } from "./models/project";
import { useState } from "react";
import { v4 } from "uuid";
import { Code } from "./models/code";
import QRCode from "react-qr-code";
import { Delete, DeleteTwoTone } from "@mui/icons-material";

function App() {
  const projects = JSON.parse(
    localStorage.getItem("qapo") ?? "[]"
  ) as Project[];
  const [newProjName, updateNewProjName] = useState<string>("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingQrId, setDeletingQrId] = useState<string | null>(null);
  const blankCode = {
    id: "",
    name: "",
    value: "",
  } as Code;
  const [newCode, setNewCode] = useState<Code>(blankCode);

  const updateProj = (any: any) =>
    localStorage.setItem("qapo", JSON.stringify(any));

  return (
    <Tabs
      onChange={() => setDeletingId(null)} 
      aria-label="Vertical tabs"
      orientation="vertical"
      sx={{ minWidth: 300, height: 160 }}
    >
      <TabList onChange={() => setDeletingId(null)}>
        {projects.map((p, i) => (
          <Tab key={i} value={i}>
            {p.name}
          </Tab>
        ))}
        <Tab value={projects.length}>Add Project</Tab>
      </TabList>
      {projects.map((p, i) => (
        <TabPanel value={i} key={i}>
          <div style={{display: 'flex', flexDirection: 'row', width: 'fit-content'}}>
            <Input defaultValue={p.name} onBlur={(e) => {
              updateProj(projects.map((pp) => pp.id === p.id ? {...pp, name: e.target.value} : pp))
            }} style={{marginRight: 5}} />
            <IconButton variant="soft" color='danger' onClick={() => {
              if (deletingId) {
                  updateProj(projects.filter((pp) => pp.id !== p.id));
                  setDeletingId(null);
                } else {
                  setDeletingId(p.id);
                }
            }}>
              {deletingId ? <Delete /> : <DeleteTwoTone />}
            </IconButton>
          </div>
          <Divider style={{ marginTop: 10, marginBottom: 10 }} />
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            {p.codes.map((c) => <Card>
              <div style={{ height: "auto", margin: "0 auto", maxWidth: 150, width: "100%" }}>
                <QRCode
                  size={256}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  value={c.value}
                  viewBox={`0 0 256 256`}
                  />
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <Input defaultValue={c.name} style={{ marginRight: 5 }} onBlur={(e) =>
                  updateProj(projects.map((pp) => pp.id === p.id ? {
                    ...pp,
                    codes: pp.codes.map((cc) => cc.id === c.id ? {...c, name: e.target.value} : cc)
                  } : pp))} />
                <IconButton variant="soft" color='danger' onClick={() => {
                  if (deletingQrId === c.id) {
                      updateProj(projects.map((pp) => pp.id === p.id ? {
                        ...pp,
                        codes: pp.codes.filter((cc) => cc.id !== c.id)
                      } : pp));
                      setDeletingQrId(null);
                    } else {
                      setDeletingQrId(c.id);
                    }
                }}>
                  {deletingQrId === c.id ? <Delete /> : <DeleteTwoTone />}
                </IconButton>
              </div>
              <Input defaultValue={c.value} style={{ marginRight: 5 }} onBlur={(e) =>
                updateProj(projects.map((pp) => pp.id === p.id ? {
                  ...pp,
                  codes: pp.codes.map((cc) => cc.id === c.id ? {...c, value: e.target.value} : cc)
                } : pp))} />
            </Card>)}
            <Card>
              <Input
                value={newCode.name}
                onChange={(e) =>
                  setNewCode({ ...newCode, name: e.target.value })
                }
                placeholder="Name"
              />
              <Input
                value={newCode.value}
                onChange={(e) =>
                  setNewCode({ ...newCode, value: e.target.value })
                }
                placeholder="Value"
              />
              <Button
                onClick={() => {
                  updateProj(
                    projects.map((pp) =>
                      pp.id === p.id
                        ? {
                            ...pp,
                            codes: [
                              ...pp.codes,
                              {
                                id: v4(),
                                name: newCode.name,
                                value: newCode.value,
                              },
                            ],
                          }
                        : pp
                    )
                  );
                  setNewCode(blankCode);
                }}
              >
                Add Code
              </Button>
            </Card>
          </div>
        </TabPanel>
      ))}
      <TabPanel value={projects.length}>
        <div style={{ width: "fit-content" }}>
          <Input
            value={newProjName}
            onChange={(e) => updateNewProjName(e.target.value)}
            placeholder="Project Name"
          />
          <Button
            style={{ marginTop: 5 }}
            onClick={() => {
              updateProj([
                ...projects,
                {
                  id: v4(),
                  name: newProjName,
                  codes: [],
                } as Project,
              ]);
              updateNewProjName("");
            }}
          >
            Add Project
          </Button>
        </div>
      </TabPanel>
    </Tabs>
  );
}

export default App;
