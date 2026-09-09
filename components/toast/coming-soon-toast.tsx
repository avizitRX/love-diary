import { toast } from '../ui/toast';

const ComingSoonToast = () => {
  return toast.add({
    type: "info",
    description: "Coming soon....",
  });
}

export default ComingSoonToast
