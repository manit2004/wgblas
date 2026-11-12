CC = nvcc
BIN = bin
HDRS = ../../utils/helpers.h ../../utils/harness.h ../../utils/params.h

all: $(BIN)/scopy

$(BIN):
	mkdir -p $(BIN)

$(BIN)/scopy: scopy.c $(HDRS) | $(BIN)
	$(CC) scopy.c -o $(BIN)/scopy -lcublas

clean:
	rm -rf $(BIN)
