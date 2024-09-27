import React from 'react';

const SocialFeed = () => {
    return (
        <div className="grid grid-cols-8 h-screen">
            {/* Left side - Profile section */}
            <div className="col-span-2 bg-gray-100 p-4">
                <div className="sticky top-0">
                    {/* Profile Info */}
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-xl font-semibold">Profile Name</h2>
                        <p>@username</p>
                        <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">Follow</button>
                    </div>
                    {/* Additional profile info */}
                    <div className="mt-8">
                        <h3 className="text-lg font-semibold">About</h3>
                        <p>Bio and more details...</p>
                    </div>
                </div>
            </div>

            {/* Right side - Feed section */}
            <div className="col-span-6 bg-gray-50 p-4 overflow-y-auto">
                {/* Feed */}
                <div className="space-y-4">
                    {/* Post 1 */}
                    <div className="bg-white p-4 rounded shadow">
                        <h3 className="font-semibold text-lg">User 1</h3>
                        <p>Here's the first post content...</p>
                    </div>
                    {/* Post 2 */}
                    <div className="bg-white p-4 rounded shadow">
                        <h3 className="font-semibold text-lg">User 2</h3>
                        <p>Here's the second post content...</p>
                    </div>
                    {/* More posts */}
                    <div className="bg-white p-4 rounded shadow">
                        <h3 className="font-semibold text-lg">User 3</h3>
                        <p>Another post content...</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SocialFeed;
