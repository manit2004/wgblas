CC = nvcc
BIN = bin
HDRS = ../../utils/helpers.h ../../utils/harness.h ../../utils/params.h

all: $(BIN)/dcopy

$(BIN):
	mkdir -p $(BIN)

$(BIN)/dcopy: dcopy.c $(HDRS) | $(BIN)
	$(CC) dcopy.c -o $(BIN)/dcopy -lcublas

clean:
	rm -rf $(BIN)
