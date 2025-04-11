import { User, Mail, Phone, Loader2 } from 'lucide-react';

function ProfileInfo({ profileForm, setProfileForm, handleProfileUpdate, loading }) {
  
  return (
    <div>
      <h2 className="text-xl font-medium mb-6">Profile Information</h2>
      <form onSubmit={handleProfileUpdate}>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="pl-10 block w-full rounded-md border border-gray-300 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="pl-10 block w-full rounded-md border border-gray-300 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="john@example.com"
                required
                disabled
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                value={profileForm.phoneNumber || ''}
                onChange={(e) => setProfileForm({ ...profileForm, phoneNumber: e.target.value })}
                className="pl-10 block w-full rounded-md border border-gray-300 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="+1 (123) 456-7890"
                required
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Updating...
            </div>
          ) : (
            'Update Profile'
          )}
        </button>
      </form>
    </div>
  );
}

export default ProfileInfo;