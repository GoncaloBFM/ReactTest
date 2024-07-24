import React from "react";
import DashboardLayout from "@/components/dashboard-layout";
import Scatterplot from "@/components/scatterplot";
import Table from "@/components/table";
import Wordcloud from "@/components/wordcloud";

export default function Home() {
  return (
          <DashboardLayout
              vis1={<Table></Table>}
              vis2={<Wordcloud></Wordcloud>}
              vis3={<Scatterplot></Scatterplot>}
          >
          </DashboardLayout>
  );
}
