%{!?iteration: %global iteration 1}
%{!?rpm_release: %global rpm_release %(date "+%%Y%%m%%d.%%H%%M")}

%define _builddir .

%define dist_dir /home/www/%{name}

Name:           webtv
Version:        %{iteration} 
Release:        %{rpm_release}%{?dist} 
Summary:        Recognia Web TV webapp 

Group:          Development/Libraries 
License:        Proprietary
URL:            FIXME
#Source0: http://registry.npmjs.org/%{npmname}/-/%{npmname}-%{version}.tgz 
Source0:        technical-insight.tgz 
BuildRoot:      %(mktemp -ud %{_tmppath}/%{name}-%{version}-%{release}-XXXXXX) 

BuildArch:      noarch

Requires:       recognia-release-conf
# App was renamed
Obsoletes:      event-lookup
# App was merged in
Obsoletes:      event-screener

%description
Compiled static files for the Recognia Web TV webapp. 


%install 
rm -rf %{buildroot} 

mkdir -p %{buildroot}%{dist_dir}
cp -a dist/* %{buildroot}%{dist_dir}

%clean
rm -rf %{buildroot}

#%%post
#recognia-release-webapp-config %{dist_dir}/locale/*/*bundle.js*

%files
%defattr(-,root,root,-)
%{dist_dir}


%changelog
* Wed Apr 11 2018 Malcolm Studd <mstudd@recognia.com> - 131-1 
- Initial packaging
