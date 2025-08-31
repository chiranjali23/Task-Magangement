"""
Complete Registration Test Script
Run this to test your database connection and user registration
"""

import json
import requests
from datetime import datetime

# Configuration
API_BASE_URL = 'http://localhost:5000'

def test_api_health():
    """Test if the API is running"""
    try:
        response = requests.get(f"{API_BASE_URL}/api/health")
        if response.status_code == 200:
            data = response.json()
            print("✅ API Health Check:")
            print(f"   Status: {data.get('status', 'Unknown')}")
            print(f"   Message: {data.get('message', 'No message')}")
            return True
        else:
            print(f"❌ API Health Check Failed: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to API. Make sure the server is running.")
        return False
    except Exception as e:
        print(f"❌ API Health Check Error: {e}")
        return False

def test_user_registration(name, email, password):
    """Test user registration"""
    try:
        print(f"\n📝 Testing Registration for: {name} ({email})")
        
        user_data = {
            "name": name,
            "email": email,
            "password": password
        }
        
        response = requests.post(
            f"{API_BASE_URL}/api/register",
            headers={'Content-Type': 'application/json'},
            json=user_data
        )
        
        print(f"   Response Status: {response.status_code}")
        
        if response.status_code == 201:
            data = response.json()
            print("✅ Registration Successful!")
            print(f"   User ID: {data['user']['id']}")
            print(f"   Name: {data['user']['name']}")
            print(f"   Email: {data['user']['email']}")
            print(f"   Created: {data['user']['created_at']}")
            print(f"   Token: {data['access_token'][:20]}...")
            return data
        else:
            data = response.json()
            print(f"❌ Registration Failed: {data.get('message', 'Unknown error')}")
            return None
            
    except Exception as e:
        print(f"❌ Registration Test Error: {e}")
        return None

def test_user_login(email, password):
    """Test user login"""
    try:
        print(f"\n🔐 Testing Login for: {email}")
        
        login_data = {
            "email": email,
            "password": password
        }
        
        response = requests.post(
            f"{API_BASE_URL}/api/login",
            headers={'Content-Type': 'application/json'},
            json=login_data
        )
        
        print(f"   Response Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Login Successful!")
            print(f"   User: {data['user']['name']}")
            print(f"   Email: {data['user']['email']}")
            print(f"   Last Login: {data['user']['last_login']}")
            print(f"   Token: {data['access_token'][:20]}...")
            return data
        else:
            data = response.json()
            print(f"❌ Login Failed: {data.get('message', 'Unknown error')}")
            return None
            
    except Exception as e:
        print(f"❌ Login Test Error: {e}")
        return None

def test_profile_access(access_token):
    """Test profile access with JWT token"""
    try:
        print(f"\n👤 Testing Profile Access...")
        
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }
        
        response = requests.get(
            f"{API_BASE_URL}/api/profile",
            headers=headers
        )
        
        print(f"   Response Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Profile Access Successful!")
            print(f"   User: {data['user']['name']}")
            print(f"   Email: {data['user']['email']}")
            print(f"   Verified: {data['user']['is_verified']}")
            return data
        else:
            data = response.json()
            print(f"❌ Profile Access Failed: {data.get('message', 'Unknown error')}")
            return None
            
    except Exception as e:
        print(f"❌ Profile Access Test Error: {e}")
        return None

def run_complete_test():
    """Run complete registration and authentication test"""
    print("🚀 Starting Complete Registration & Authentication Test")
    print("=" * 60)
    
    # Test 1: API Health Check
    if not test_api_health():
        print("\n❌ Stopping tests - API is not accessible")
        return False
    
    # Test data
    test_users = [
        {
            "name": "John Doe",
            "email": "john.doe@example.com",
            "password": "securepassword123"
        },
        {
            "name": "Jane Smith", 
            "email": "jane.smith@example.com",
            "password": "anotherpassword456"
        }
    ]
    
    successful_tests = 0
    
    for i, user in enumerate(test_users, 1):
        print(f"\n{'='*20} Test User {i} {'='*20}")
        
        # Test 2: User Registration
        reg_result = test_user_registration(
            user["name"], 
            user["email"], 
            user["password"]
        )
        
        if reg_result:
            successful_tests += 1
            
            # Test 3: User Login
            login_result = test_user_login(
                user["email"], 
                user["password"]
            )
            
            if login_result:
                successful_tests += 1
                
                # Test 4: Profile Access
                profile_result = test_profile_access(
                    login_result["access_token"]
                )
                
                if profile_result:
                    successful_tests += 1
        
        # Test duplicate registration (should fail)
        print(f"\n🔄 Testing Duplicate Registration for: {user['email']}")
        duplicate_result = test_user_registration(
            user["name"], 
            user["email"], 
            user["password"]
        )
        
        if not duplicate_result:
            print("✅ Duplicate registration properly rejected")
            successful_tests += 1
    
    # Summary
    print(f"\n{'='*60}")
    print(f"🏁 Test Summary:")
    print(f"   Total Tests: {successful_tests}")
    print(f"   Expected: {len(test_users) * 4}")  # 4 tests per user
    print(f"   Success Rate: {(successful_tests / (len(test_users) * 4)) * 100:.1f}%")
    
    if successful_tests >= len(test_users) * 3:  # At least 3/4 tests should pass
        print("✅ Registration system is working properly!")
        return True
    else:
        print("❌ Some tests failed. Check your configuration.")
        return False

if __name__ == "__main__":
    print("🧪 TaskFlux Registration System Test")
    print(f"📅 Test Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"🌐 API URL: {API_BASE_URL}")
    print()
    
    try:
        success = run_complete_test()
        if success:
            print("\n🎉 All systems are working correctly!")
        else:
            print("\n⚠️ Some issues detected. Please check your setup.")
            
    except KeyboardInterrupt:
        print("\n\n❌ Test interrupted by user")
    except Exception as e:
        print(f"\n❌ Unexpected error during testing: {e}")
        
    print("\n👋 Test completed!")