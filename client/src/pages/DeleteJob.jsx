import { redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import Job from "../components/Job";
import customFetch from '../utils/customFetch.js';

export const deleteJob = async (req, res) => {
  const { id } = req.params;
  const removedJob = await Job.findByIdAndDelete(id);

  if (!removedJob) {
    return res.status(404).json({ msg: `no job with id ${id}` });
  }
  res.status(200).json({ job: removedJob });
};


export async function action({ params }) {
  try {
    await customFetch.delete(`/jobs/${params.id}`);
    toast.success('Job deleted successfully');
  } catch (error) {
    toast.error(error.response.data.msg);
  }
  return redirect('/dashboard/all-jobs');
}