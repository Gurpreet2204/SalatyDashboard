import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import LineGraph from './LineGraph';

interface JobData {
  work_year: number;
  experience_level: string;
  employment_type: string;
  job_title: string;
  salary: number;
  salary_currency: string;
  salary_in_usd: number;
  employee_residence: string;
  remote_ratio: number;
  company_location: string;
  company_size: string;
}

interface AggregatedData {
  year: number;
  totalJobs: number;
  averageSalary: number;
}

interface JobTitleCount {
  job_title: string;
  count: number;
}

const SalaryTable: React.FC = () => {
  const [data, setData] = useState<AggregatedData[]>([]);
  const [jobData, setJobData] = useState<JobData[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof AggregatedData; direction: string } | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [jobTitleCounts, setJobTitleCounts] = useState<JobTitleCount[]>([]);

  useEffect(() => {
    fetch('/data.json')
      .then(response => response.json())
      .then((jobData: JobData[]) => {
        setJobData(jobData);
        const aggregatedData = jobData.reduce((acc: AggregatedData[], job) => {
          const existingYearData = acc.find(item => item.year === job.work_year);
          if (existingYearData) {
            existingYearData.totalJobs += 1;
            existingYearData.averageSalary = (existingYearData.averageSalary * (existingYearData.totalJobs - 1) + job.salary_in_usd) / existingYearData.totalJobs;
          } else {
            acc.push({ year: job.work_year, totalJobs: 1, averageSalary: job.salary_in_usd });
          }
          return acc;
        }, []);
        setData(aggregatedData);
      });
  }, []);

  const handleSort = (key: keyof AggregatedData) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleRowClick = (year: number) => {
    setSelectedYear(year);
    const jobsInYear = jobData.filter((job) => job.work_year === year);
    const titleCounts = jobsInYear.reduce((acc: JobTitleCount[], job) => {
      const existingTitleData = acc.find(item => item.job_title === job.job_title);
      if (existingTitleData) {
        existingTitleData.count += 1;
      } else {
        acc.push({ job_title: job.job_title, count: 1 });
      }
      return acc;
    }, []);
    setJobTitleCounts(titleCounts);
  };

  const sortedData = React.useMemo(() => {
    if (sortConfig !== null) {
      return [...data].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return data;
  }, [data, sortConfig]);

  const getIcon = (key: keyof AggregatedData) => {
    if (!sortConfig || sortConfig.key !== key) {
      return faSort;
    }
    return sortConfig.direction === 'ascending' ? faSortUp : faSortDown;
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">ML Engineer Salaries</h2>
      <LineGraph data={data} />
      <table className="min-w-full bg-white border border-gray-300 mt-4">
        <thead>
          <tr>
            <th
              className="py-2 px-4 border border-gray-300 cursor-pointer"
              onClick={() => handleSort('year')}
            >
              Year <FontAwesomeIcon icon={getIcon('year')} />
            </th>
            <th
              className="py-2 px-4 border border-gray-300 cursor-pointer"
              onClick={() => handleSort('totalJobs')}
            >
              Total Jobs <FontAwesomeIcon icon={getIcon('totalJobs')} />
            </th>
            <th
              className="py-2 px-4 border border-gray-300 cursor-pointer"
              onClick={() => handleSort('averageSalary')}
            >
              Average Salary (USD) <FontAwesomeIcon icon={getIcon('averageSalary')} />
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row) => (
            <tr key={row.year} className="cursor-pointer" onClick={() => handleRowClick(row.year)}>
              <td className="py-2 px-4 border border-gray-300">{row.year}</td>
              <td className="py-2 px-4 border border-gray-300">{row.totalJobs}</td>
              <td className="py-2 px-4 border border-gray-300">${row.averageSalary.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedYear && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">Job Titles in {selectedYear}</h3>
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 border border-gray-300">Job Title</th>
                <th className="py-2 px-4 border border-gray-300">Count</th>
              </tr>
            </thead>
            <tbody>
              {jobTitleCounts.map((row) => (
                <tr key={row.job_title}>
                  <td className="py-2 px-4 border border-gray-300">{row.job_title}</td>
                  <td className="py-2 px-4 border border-gray-300">{row.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SalaryTable;