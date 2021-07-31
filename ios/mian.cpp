//
//  main.cpp
//  NSTask
//
//  Created by obaby on 14-2-27.
//  Copyright (c) 2014年 __MyCompanyName__. All rights reserved.
//

#import "AppDelegate.h"
#include <iostream>
#include "NSTask.h"
#include <CoreData/CoreData.h>

void PingTest();

void PingTest()
{
    NSTask *task;
    task = [[NSTask alloc ]init];
    [task setLaunchPath:@"/usr/bin/ping"];
        
    NSLog(@"This is NSTask with ping command......\n");
    NSArray *arguments;
    arguments = [NSArray arrayWithObjects:@"www.h4ck.org.cn", nil];
    [task setArguments:arguments];
        
    NSPipe *pipe;
    pipe = [NSPipe pipe];
    [task setStandardOutput:pipe];
        
    NSFileHandle *file;
    file = [pipe fileHandleForReading];
        
    [task launch];
        
    NSData *data;
    data = [file readDataToEndOfFile];
        
    NSString *string;
    string = [[NSString alloc]initWithData:data encoding:NSUTF8StringEncoding];
        
    NSLog(@"%@",string);
}

int main (int argc, const char * argv[])
{

    // insert code here...
    PingTest();
    //std::cout << "Hello, World!\n";
	return 0;
}

