import { useEffect, useState } from "react";
import axios from "axios";
import AnalyticalCard from "../cards/AnalyticalCard";
import "../../styles/analytics.css";
import { toast } from "react-toastify";
import { useLoader } from "../Providers/LoaderProvider";
import { DoughnutChart } from "../general/Charts";

// Define the type for the card properties
interface CardProperty {
  label: string;
  title: string;
  value: number;
}

const Analytics = () => {
  const [firstCardProperties, setFirstCardProperties] = useState<CardProperty[]>([]);
  const [secondCardProperties, setSecondCardProperties] = useState<CardProperty[]>([]);
  const { setIsLoading } = useLoader();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const token = localStorage.getItem("authToken");
        if (!token) {
          toast.error("No token found");
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/analytics`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              id: localStorage.getItem("userId"),
            },
          }
        );

        if (response?.data.success) {
          const data = response.data.data;

          setFirstCardProperties([
            {
              label: "Backlog Tasks",
              title: "backlogtasks",
              value: data.backlogTasks,
            },
            { label: "To-Do Tasks", title: "todotasks", value: data.todoTasks },
            {
              label: "In Progress Tasks",
              title: "inprogresstasks",
              value: data.inProgressTasks,
            },
            {
              label: "Completed Tasks",
              title: "completedtasks",
              value: data.completedTasks,
            },
          ]);

          setSecondCardProperties([
            {
              label: "Low Priority Tasks",
              title: "lowprioritytasks",
              value: data.lowPriorityTasks,
            },
            {
              label: "Moderate Priority Tasks",
              title: "moderateprioritytasks",
              value: data.moderatePriorityTasks,
            },
            {
              label: "High Priority Tasks",
              title: "highprioritytasks",
              value: data.highPriorityTasks,
            },
            {
              label: "Due Date Tasks",
              title: "taskswithduedate",
              value: data.tasksWithDueDate,
            },
          ]);
        } else {
          toast.error(
            response?.data.message || "Failed to fetch analytical data"
          );
        }
      } catch (error) {
        console.error("Error fetching analytical data:", error);
        toast.error("Something went wrong while fetching analytical data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [setIsLoading]);

  // Helper functions with types
  const extractValues = (properties: CardProperty[]): number[] =>
    properties.map(prop => prop.value);
    
  const extractLabels = (properties: CardProperty[]): string[] =>
    properties.map(prop => prop.label);

  return (
    <>
      <h2>Analytics</h2>
      <div className="analytics-container">
        <div className="card-chart-row">
          <div className="card-container">
            <AnalyticalCard properties={firstCardProperties} />
          </div>
          <div className="chart-container">
            <DoughnutChart
              labels={extractLabels(firstCardProperties)}
              value={extractValues(firstCardProperties)}
            />
          </div>
        </div>

        <div className="card-chart-row">
          <div className="card-container">
            <AnalyticalCard properties={secondCardProperties} />
          </div>
          <div className="chart-container">
            
            <DoughnutChart
              labels={extractLabels(secondCardProperties)}
              value={extractValues(secondCardProperties)}
            />     
             
          </div>
        </div>
      </div>
    </>
  );
};

export default Analytics;
